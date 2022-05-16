const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Studente = require('./models/studente.js');
const Prenotazione = require('./models/prenotazione.js');
const Istruttore = require('./models/istruttore.js');
const Segreteria = require('./models/segreteria.js');

router.get('/guideStudenti',async (req,res)=>{
    //Visualizza le guide prenotate di tutti gli studenti
    let prenotazioni = await Prenotazione.find({});
    prenotazioni = prenotazioni.map((prenot)=>{
        return {
            self: "api/v1/prenotazioni/" + prenot.id,
            slot: prenot.slot,
            id_studente: prenot.id_studente,
            id_istruttore: prenot.id_istruttore,
            presenza: prenot.presenza
        };
    })
    res.status(200).json(prenotazioni);
    
});

router.get('/resocontoStudenti',(req,res)=>{
    //Visualizza i dati personali di tutti gli studenti
});


module.exports = router;