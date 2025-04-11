import express, {Router} from "express";
import {Socket} from "net";
import { getTcpData } from "../app";



const router: Router = express.Router();

let recived_data: string = '';

export const updateTcpData = (data: string) => {
    recived_data += data + "\n";
};

router.get('/', async (req, res) => {

    let data: string = getTcpData();

    res.render("index", {data});
  });


export default router;
