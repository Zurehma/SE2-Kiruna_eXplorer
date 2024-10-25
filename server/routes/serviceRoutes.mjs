// Module for the authentication routes

import { Router } from "express";
import { check } from "express-validator";

import Utility from "../utilities.mjs";

import ServiceDAO from "../dao/serviceDAO.mjs";

import Queue from "../models/queue.mjs";

/**
 *
 */
function ServiceRoutes() {
  this.router = Router();

  this.getRouter = () => this.router;

  let ps_queue = new Queue(); //queue for public service operations
  let mt_queue = new Queue(); //queue for money transfer operations
  let sr_queue = new Queue(); //queue for shipping and receiving operations

  this.initRoutes = () => {

    //Route for user to get new ticket
    this.router.post("/ticket",
    [check("service").isString().notEmpty(),
    Utility.validateRequest],
    async(req,res)=>{
      const service = req.body.service.toLowerCase();
      let ticket = "";
      if (service === "public service"){
        ticket = "PS" + (ps_queue.length()+1);
        ps_queue.enqueue(ticket);
      } else if (service === "money transfer"){
        ticket = "MT" + (mt_queue.length()+1);
        mt_queue.enqueue(ticket);
      } else if (service === "shipping and receiving"){
        ticket = "SR" + (sr_queue.length()+1);
        sr_queue.enqueue(ticket);
      } else {
        return res.status(400).json({message: "Invalid service"});
      }
      return res.status(200).json({ticket: ticket});
    })

    //Route for manager or admin to clear queues
    this.router.delete("/resetQueues", Utility.isLoggedIn, async(req,res)=>{
      ps_queue.clear();
      mt_queue.clear();
      sr_queue.clear();
      return res.status(200).json({message: "Queues cleared"});
    });
    
    



  };
}

export default ServiceRoutes;
