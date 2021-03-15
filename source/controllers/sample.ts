import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import fetch from 'node-fetch';
import convert from 'xml-js';

const NAMESPACE = 'GovInfoController';
const sampleHealthCheck = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, `TestBillStatus`);
    const apiKey = 'CPF4gDUPheMTqwrDm2mMq0PHIopn8sg10E2Za7ln';

    const test = await fetch(`https://www.govinfo.gov/bulkdata/BILLSTATUS/117/sconres/BILLSTATUS-117sconres7.xml?api_key=${apiKey}`);

    const jsonResponse = convert.xml2json(await test.text(), {
        compact: true,
        trim: true,
        ignoreDeclaration: true,
        ignoreInstruction: true,
        ignoreAttributes: true,
        ignoreComment: true,
        ignoreCdata: true,
        ignoreDoctype: true,
        spaces: 4,
        textFn: (value, parentElement: any) => {
            try {
                var keyNo = Object.keys(parentElement._parent).length;
                var keyName = Object.keys(parentElement._parent)[keyNo - 1];
                parentElement._parent[keyName] = value;
            } catch (e) {}
        }
    });
    return res.status(200).json({
        message: JSON.parse(jsonResponse)
    });
};

export default { sampleHealthCheck };
