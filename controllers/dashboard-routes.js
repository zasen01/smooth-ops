const router = require("express").Router();
const { User, Post, Comment, Pokemon, Team, PokeTeam } = require("../models");
const withAuth = require("../utils/auth");

// render user posts and pokemon to dashboard
router.get('/', withAuth, async (req,res)=>{
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: ['id', 'title', 'description', 'created_at'],
        include: [
            {
                model: Team,
                include: [{
                    model: Pokemon,
                    through: PokeTeam
                }]
            },
            {
                model: Comment,
                attributes: ['id', 'text', 'user_id', 'created_at'],
                include: [{
                    model: User,
                    attributes: ['trainer_name']
                }]
            },
            {
                model: User,
                attributes: ['trainer_name']
            }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true })); //map each post to display as seperate entity
        
        Pokemon.findAll({
        attributes: ['name', 'url', 'id'],
        order: ['name']
        })
        .then(dbPokemonData => {
        const pokemon = dbPokemonData.map(pokemon  => pokemon.get({ plain: true }))
        res.render('dashboard', { // <<<<<<< render posts and pokemon to dashboard
            posts,
            pokemon,
            loggedIn: req.session.loggedIn
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    })
})


// TODO: add route to edit user's posts and render edit-post page with post to be edited
//route to edit user's post by rendering edit-post page with user authentication 
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'description', 'created_at'],
        include: [
            {
                model: Team,
                include: [{
                    model: Pokemon,
                    through: PokeTeam
                }]
            },
            {
                model: Comment,
                attributes: ['id', 'text', 'user_id', 'created_at'],
                include:  {
                    model: User,
                    attributes: ['trainer_name']
                }
            },
            {
                model: User,
                attributes: ['trainer_name']
            }
        ]
    })
    .then(dbPostdata => {
        if (!dbPostdata) {
            res.status(404).json({ message: 'No Post found with that ID.'})
            return;
        }

        const post = dbPostdata.get({ plain: true });
        res.render('edit-post', { post, loggedIn: true })
    })
    .catch(err => {
        console.log(err);
        re.status(500).json(err);
    })
});

router.get('/', async (req,res) => {
    Pokemon.findAll({
        attributes: ['name', 'url'],
        order: ['name']
    })
    .then(dbPokemonData => {
        const pokemon = dbPokemonData.map(pokemon  => pokemon.get({ plain: true }))
        res.render('dashboard', { // <<<<<<< render to dashboard to populate selection modal for post creation/team building 
            pokemon, // Render Pokemon Selector Modal ^
            loggedIn: req.session.loggedIn
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;


// //render dashboard with logged in user's posts
// router.get('/', withAuth, async (req,res)=>{
//     Post.findAll({
//         where: {
//             user_id: req.session.user_id
//         },
//         attributes: ['id', 'title', 'description', 'created_at'],
//         include: [
//             {
//                 model: Team,
//                 include: [{
//                     model: Pokemon,
//                     through: PokeTeam
//                 }]
//             },
//             {
//                 model: Comment,
//                 attributes: ['id', 'text', 'user_id', 'created_at'],
//                 include: [{
//                     model: User,
//                     attributes: ['trainer_name']
//                 }]
//             },
//             {
//                 model: User,
//                 attributes: ['trainer_name']
//             }
//         ]
//     })
//     .then(dbPostData => {
//         const posts = dbPostData.map(post => post.get({ plain: true })); //map each post to display as seperate entity 
//         res.render('dashboard', { 
//             posts,
//             loggedIn: req.session.loggedIn // only render the page if a user is logged in 
//         })
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//     });


// // render pokemon to homepage 
//     Pokemon.findAll({
//         attributes: ['name', 'url'],
//         order: ['name']
//     })
//     .then(dbPokemonData => {
//         const pokemon = dbPokemonData.map(pokemon  => pokemon.get({ plain: true }))
//         res.render('dashboard', { // <<<<<<< render to dashboard to populate selection modal for post creation/team building 
//             pokemon, // Render Pokemon Selector Modal ^
//             loggedIn: req.session.loggedIn
//         })
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//     })
// })
