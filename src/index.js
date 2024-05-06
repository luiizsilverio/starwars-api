import dotenv from 'dotenv';
import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use(express.json());

dotenv.config({ path: './.env.local' });


const Movie = mongoose.model('movies', new mongoose.Schema({
  title: String,
  description: String,
  image_url: String,
  trailer_url: String
}));


app.get('/', (req, res) => {
  return res.send("API StarWars 🚀")
})

app.get('/movies', async (req, res) => {
  const movies = await Movie.find();
  return res.send(movies);
})

app.get('/movies/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById( id );
    return res.send(movie);
  }
  catch (err) {
    res.status(400).send({ message: err.message });
  }
})

app.post('/movie', async (req, res) => {
  const { title, description, image_url, trailer_url } = req.body;

  const movie = new Movie({
    title, description, image_url, trailer_url
  })

  try {
    await movie.save();
    res.send({ message: "Filme incluído com sucesso" });
  } 
  catch (err) {
    res.status(400).send({ message: err.message });
  }
})

app.delete('/movie/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Movie.findByIdAndDelete( id );
    return res.send({ message: "Filme excluído com sucesso" });
  }
  catch (err) {
    res.status(400).send({ message: err.message });
  }
})

app.put('/movie/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, image_url, trailer_url } = req.body;

  try {
    await Movie.findByIdAndUpdate( id, { 
      title, 
      description, 
      image_url, 
      trailer_url 
    });

    return res.send({ message: "Filme alterado com sucesso" });
  }
  catch (err) {
    res.status(400).send({ message: err.message });
  }
})

app.listen(port, () => {
  console.log(`StarWars API rodando na porta ${port}`);

  mongoose.connect(process.env.MONGODB_DATABASE);

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'DB connection error'));

  db.once('open', () => {
    console.log("BD conectado com sucesso");
  })
})