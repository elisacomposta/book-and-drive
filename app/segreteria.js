const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Studente = require('./models/studente.js');
const Prenotazione = require('./models/prenotazione.js');
const Istruttore = require('./models/istruttore.js');
const Segreteria = require('./models/segreteria.js');
const studente = require('./models/studente.js');

router.get('/guideStudenti', async (req,res)=>{
    //Visualizza le guide prenotate di tutti gli studenti
    let prenotazioni = await Prenotazione.find({}).exec();
    prenotazioni = prenotazioni.map((prenot)=>{
        return {
            self: "api/v1/prenotazioni/" + prenot.id,
            studente: prenot.nominativo_studente,
            slot: prenot.slot.toISOString(),
            istruttore: prenot.username_istruttore,
            presenza: prenot.presenza
        }
    })
    res.status(200).json(prenotazioni);
});

router.get('/guideStudente', async (req,res)=>{
    const query = req.query
    // guardo se il campo è vuoto
    if(query._id==""){
        res.status(400).json({error:"L'id dello studente non è stato specificato"});
        return;
    }
    // guardo se lo studente inserito esiste nel db
    let profilo = null
    profilo = await Studente.findById(query._id).exec();
    if(profilo == null){
        res.status(404).json({error:"Questo studente non esiste, controlla se lo hai inserito correttamente!"});
        return;
    }
    // cerco le prenotazioni di un particolare studente
    let prenotazioni = await Prenotazione.find({username_studente: query._id}).exec();
    // se non ha prenotazioni, ritono una stringa che lo specifica
    if(prenotazioni.length==0){
        res.status(204).json({message:"Questo studente al momento non ha guide prenotate o fatte"});
        return;
    }
    prenotazioni = prenotazioni.map((prenot)=>{
        return {
            self: "api/v1/prenotazioni/" + prenot.id,
            studente: prenot.nominativo_studente,
            slot: prenot.slot.toISOString(),
            istruttore: prenot.username_istruttore,
            presenza: prenot.presenza
        }
    })
    res.status(200).json(prenotazioni);
});



router.get('/resocontoStudenti', async (req,res)=>{
    // Visualizza dati personali di tutti gli studenti
    let studenti = await Studente.find({}).exec();
    studenti = studenti.map((profile) => {
        return{
            self: "api/v1/studenti/" + profile.id,
            foglio_rosa: profile._id,
            nome: profile.nome,
            cognome: profile.cognome,
            dataNascita: profile.dataNascita.toISOString(),
            telefono: profile.telefono,
            email: profile.email
        }
    })
    res.status(200).json(studenti);
});

router.get('/resocontoStudente', async(req, res)=>{
    //visualizza dati di un determinato studente
    const query = req.query;
    const idFR = query.id;

    try{
        let studente = await Studente.findById(idFR);
        res.status(200).json({
        self: '/api/v1/studenti/' + studente.id,
        foglio_rosa: studente._id,
        nome: studente.nome,
        cognome: studente.cognome,
        dataNascita: studente.dataNascita.toISOString(),
        telefono: studente.telefono,
        email: studente.email
        })
    }
    catch(err){
        res.status(400).json({
            confirm: 'fail',
            error: err.message,
            description: 'Impossibile caricare dati personali'
        })
    }
});

module.exports = router;