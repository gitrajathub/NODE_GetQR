const nodemailer = require('nodemailer');
const qrcode = require('qrcode');
const fs = require('fs');

const dotenv = require("dotenv");
require('dotenv').config();


//get qr --------------------------------------

exports.getQrHere = async (req, res) => {
    try{

        const {name, data} = req.body;
        const options = {
        errorCorrectionLevel: 'H', 
        type: 'image/png', 
        rendererOpts: {
            quality: 0.8 
        }
        };

        const filename = `${name}.png`

        qrcode.toFile(filename, data, options, (error) => {
            if (error) {
              console.error('Error generating QR code:', error);
              res.status(500).json({ error: 'Error generating QR code' });
            } 
            else {
              console.log('QR code generated successfully');
              res.status(500).json({ error: 'QR code generated successfully' });

            }
        });

    }
    catch(error){
        res.status(500).json({ error: 'Server Error' });
    }
}


//get qr in email --------------------------------------

exports.getQrInEmail = async (req, res) => {
    try{

        const {name, data, email} = req.body;
        console.log(name, data, email);
        const options = {
        errorCorrectionLevel: 'H', 
        type: 'image/png', 
        rendererOpts: {
            quality: 0.8 
        }
        };

        const filename = `${name}.png`
        console.log(filename);
        console.log(process.env.email);

        qrcode.toFile(filename, data, options, (error) => {
            if (error) {
              console.error('Error generating QR code:', error);
              res.status(500).json({ error: 'Error generating QR code' });
            } 
            else {
                console.log('QR code generated successfully');
                try{
                    const transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                        user: process.env.gmail, 
                        pass: process.env.gmail_password 
                        }
                    });
                    const mailOptions = {
                        from: process.env.gmail, 
                        to: email, 
                        subject: 'GetQR',
                        text: `Here's your QR code for "${name}"`,
                        attachments: [
                            {
                              filename: `${name}.png`,
                              path: `./${name}.png`
                            }
                          ]
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                        console.error('Error occurred:', error);
                        } else {
                        console.log('Email sent:', info.response);
                        }
                    });
                    res.status(500).json({ message: 'QR code generated successfully, Email sent' });

                }
                catch{
                    res.status(500).send('Error in sending email');
                    console.log('Error in sending email');
                }
            }
        });

    }
    catch(error){
        res.status(500).json({ error: 'Server Error' });
    }
}
