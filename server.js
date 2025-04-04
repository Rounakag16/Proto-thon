const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

let pendingProducts = [];
let approvedProducts = [
    {
        id: 101,
        name: "Recycled Notebook",
        description: "Notebook made from 100% recycled paper.",
        sustainabilityInfo: "Certified eco-friendly",
        materials: "eco-friendly",
        energyUsage: 5,
        carbonFootprint: 8,
        recyclability: true,
        ethicalSourcing: true,
        avgRating: 4.5
    },
    {
        id: 102,
        name: "Bamboo Toothbrush",
        description: "A biodegradable toothbrush made from bamboo.",
        sustainabilityInfo: "Plastic-free packaging",
        materials: "eco-friendly",
        energyUsage: 3,
        carbonFootprint: 6,
        recyclability: true,
        ethicalSourcing: true,
        avgRating: 5.0
    },
    {
        id: 103,
        name: "Solar-Powered Phone Charger",
        description: "A portable phone charger powered by solar energy.",
        sustainabilityInfo: "Uses renewable solar energy",
        materials: "partially sustainable",
        energyUsage: 0,
        carbonFootprint: 2,
        recyclability: true,
        ethicalSourcing: true,
        avgRating: 4.8
    },
    {
        id: 104,
        name: "Organic Cotton T-Shirt",
        description: "A soft and breathable T-shirt made from 100% organic cotton.",
        sustainabilityInfo: "Fair trade certified and pesticide-free",
        materials: "eco-friendly",
        energyUsage: 20,
        carbonFootprint: 15,
        recyclability: true,
        ethicalSourcing: true,
        avgRating: 4.7
    },
    {
        id: 105,
        name: "Reusable Stainless Steel Water Bottle",
        description: "A durable and reusable bottle reducing single-use plastic waste.",
        sustainabilityInfo: "BPA-free and made from 100% recyclable materials",
        materials: "eco-friendly",
        energyUsage: 10,
        carbonFootprint: 5,
        recyclability: true,
        ethicalSourcing: true,
        avgRating: 4.9
    }
];
let productReviews = {};
let sustainableBusinesses = [
    { name: "Eco Store", lat: 28.6139, lng: 77.2090 },
    { name: "Green Market", lat: 19.0760, lng: 72.8777 },
    { name: "SustainaShop", lat: 12.9716, lng: 77.5946 }
];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/');
}

function assessSustainability(product) {
    const weights = { materials: 0.25, energy: 0.20, carbon: 0.20, recycle: 0.15, ethics: 0.20 };

    function scoreMaterial(material) {
        return material === "eco-friendly" ? 100 : material === "partially sustainable" ? 70 : 30;
    }
    function scoreEnergy(usage) {
        const energy = parseFloat(usage) || 0;
        return energy < 10 ? 100 : energy < 50 ? 70 : 30;
    }
    function scoreCarbon(footprint) {
        const carbon = parseFloat(footprint) || 0;
        return carbon < 10 ? 100 : carbon < 50 ? 70 : 30;
    }
    function scoreRecycle(recyclable) {
        return recyclable === true || recyclable === "true" ? 100 : 50;
    }
    function scoreEthics(ethical) {
        return ethical === true || ethical === "true" ? 100 : 50;
    }

    const scores = {
        materials: scoreMaterial(product.materials),
        energy: scoreEnergy(product.energyUsage),
        carbon: scoreCarbon(product.carbonFootprint),
        recycle: scoreRecycle(product.recyclability),
        ethics: scoreEthics(product.ethicalSourcing)
    };

    const sustainabilityScore =
        (scores.materials * weights.materials) +
        (scores.energy * weights.energy) +
        (scores.carbon * weights.carbon) +
        (scores.recycle * weights.recycle) +
        (scores.ethics * weights.ethics);

    let rating = sustainabilityScore >= 80 ? "Excellent" : sustainabilityScore >= 60 ? "Good" : sustainabilityScore >= 40 ? "Moderate" : "Poor";

    console.log("Sustainability Score Debug:", product, sustainabilityScore, rating);
    return { score: sustainabilityScore.toFixed(2), rating };
}
app.get('/', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
    const { username, password, userType } = req.body;
    req.session.user = { username, userType };
    res.redirect(userType === 'business' ? '/business' : userType === 'admin' ? '/admin' : '/user');
});

app.get('/business', isAuthenticated, (req, res) => res.render('business', { username: req.session.user.username }));
app.post('/business/submit', isAuthenticated, (req, res) => {
    pendingProducts.push({
        id: Date.now(),
        name: req.body.name,
        description: req.body.description,
        sustainabilityInfo: req.body.sustainabilityInfo,
        materials: req.body.materials,
        energyUsage: req.body.energyUsage,
        carbonFootprint: req.body.carbonFootprint,
        recyclability: req.body.recyclability === "true",
        ethicalSourcing: req.body.ethicalSourcing === "true",
        submittedBy: req.session.user.username
    });
    res.redirect('/business');
});

app.get('/admin', isAuthenticated, (req, res) => res.render('admin', { products: pendingProducts }));
app.post('/admin/approve', isAuthenticated, (req, res) => {
    const index = pendingProducts.findIndex(p => p.id === parseInt(req.body.productId));
    if (index !== -1) approvedProducts.push(pendingProducts.splice(index, 1)[0]);
    res.redirect('/admin');
});
app.post('/admin/reject', isAuthenticated, (req, res) => {
    pendingProducts = pendingProducts.filter(p => p.id !== parseInt(req.body.productId));
    res.redirect('/admin');
});

app.get('/user', isAuthenticated, (req, res) => res.render('user', { approvedProducts }));
app.get('/product/:id', isAuthenticated, (req, res) => {
    const product = approvedProducts.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.send("Product not found");
    const reviews = productReviews[product.id] || [];
    const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2) : 'No ratings yet';
    res.render('product', { product, reviews, avgRating, sustainability: assessSustainability(product) });
});
app.post('/product/:id/review', isAuthenticated, (req, res) => {
    const productId = parseInt(req.params.id);
    const { rating, comment } = req.body;

    if (!productReviews[productId]) {
        productReviews[productId] = [];
    }

    productReviews[productId].push({
        username: req.session.user.username,
        rating: parseFloat(rating),
        comment
    });

    res.redirect(`/product/${productId}`);
});


app.get('/map', isAuthenticated, (req, res) => res.render('map', { sustainableBusinesses }));
app.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/')));
app.get('/go-back', (req, res) => req.session.destroy(() => res.redirect('user')));

app.listen(port, () => console.log(`Server started on port ${port}`));