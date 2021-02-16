const express = require("express");
const aRouter = express.Router();
const VehicleModel = require("../models/vehicleModel");


//API for fetching all the vehicle data
aRouter.get("/api/getVehicles", async function (req, res) {
    try {
        let vehicles = await VehicleModel.find().lean();
        res.status(200).json({ message: "Vehicles fetched successfully", data: vehicles });
    } catch (err) {
        handleErr(res, err);
    }
});

//API for fetching vehicle by id
aRouter.post("/api/fetchVehicleById", async function (req, res) {
    try {
        let vehicle = await VehicleModel.findOne({ _id: req.body.id }).lean();
        res.status(200).json({ message: "Vehicles fetched successfully", data: vehicle });
    } catch (err) {
        handleErr(res, err);
    }
});

//API for searching vehicle
aRouter.post(
    "/api/findSearchVehicle",
    async function (req, res) {
        try {
            let vehicles = [];
            if (req.body.id) {
                vehicles =
                    await VehicleModel.find({ $or: [{ "make": new RegExp(req.body.id, 'i') }, { "model": new RegExp(req.body.id, 'i') }, { "no": new RegExp(req.body.id, 'i') }, { "year": new RegExp(req.body.id, 'i') },{ "price": new RegExp(req.body.id, 'i') }] })
            } else {
                vehicles = await VehicleModel.find().lean();
            }
            res.status(200).json({ data: vehicles })
        } catch (err) {
            handleErr(res, err);
        }
    }
);

//API for adding new vehicle
aRouter.post(
    "/api/addVehicle",
    async function (req, res) {
        try {

            var no = await VehicleModel.findOne({})
                .sort({ no: -1 });
            var maxNo = 1;
            if (no && no.no) {
                maxNo = parseInt(no.no) + 1;
            }
            var newVehicleObj = new VehicleModel({
                no: maxNo + '',
                make: req.body.obj.make,
                model: req.body.obj.model,
                year: req.body.obj.year,
                price: req.body.obj.price,
                status: "Live",
            });

            newVehicleObj.save()
                .then(data => {
                    res.status(200).json({ message: "Added vehicle successfully", data: data })
                }).catch(err => {
                    handleErr(res, err);
                });

        } catch (err) {
            handleErr(res, err);
        }
    }
);

//API for updating vehicle using id
aRouter.post(
    "/api/updateVehicle",
    async function (req, res) {
        try {
            let updatedItem = await VehicleModel.findByIdAndUpdate(
                req.body.id,
                req.body,
                { new: true }
            ).lean();
            let vehicles = await VehicleModel.find().lean();
            res.status(200).json({ message: "Updated vehicle successfully", data: updatedItem, allVehicles: vehicles })

        } catch (err) {
            handleErr(res, err);
        }
    }
);


//API for make mark vehicle as "Sold"
aRouter.post(
    "/api/markSoldVehicle",
    async function (req, res) {
        try {
            let updatedItem = await VehicleModel.updateOne({_id: req.body.id},{
                status:'Sold'
            });
            
            let vehicles = await VehicleModel.find().lean();
            res.status(200).json({ message: "Updated vehicle successfully", data: updatedItem, allVehicles: vehicles })

        } catch (err) {
            handleErr(res, err);
        }
    }
);

//API for counting status of vehicle
aRouter.get(
    "/api/countVehicleStatus",
    async function (req, res) {
        try {
            let liveVehicles = await VehicleModel.find({ status: "Live" }).count();
            let soldVehicles = await VehicleModel.find({ status: "Sold" }).count();
            var data = {
                labels: ['Live', 'Sold'],
                datasets: [
                    {
                        label: 'Inventory Status',
                        backgroundColor: '#00009d',
                        borderColor: 'cadetblue',
                        borderWidth: 2,
                        data: [liveVehicles,soldVehicles,0]
                    }
                ]
            }
           res.status(200).json({ message: "Count vehicle status", data: data })

        } catch (err) {
            handleErr(res, err);
        }
    }
);
var self = (module.exports = aRouter);
