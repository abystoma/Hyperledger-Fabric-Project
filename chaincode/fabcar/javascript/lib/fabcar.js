/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const cars = [
            {
                name: 'aperture',
                type: 'private',
                cash_out: '1000000',
                cash_in: '22223',
                employee: "44",
                origin: "USA"
            },
            // {
            //     color: 'red',
            //     make: 'Ford',
            //     model: 'Mustang',
            //     owner: 'Brad',
            // },
            // {
            //     color: 'green',
            //     make: 'Hyundai',
            //     model: 'Tucson',
            //     owner: 'Jin Soo',
            // },
            // {
            //     color: 'yellow',
            //     make: 'Volkswagen',
            //     model: 'Passat',
            //     owner: 'Max',
            // },
            // {
            //     color: 'black',
            //     make: 'Tesla',
            //     model: 'S',
            //     owner: 'Adriana',
            // },
            // {
            //     color: 'purple',
            //     make: 'Peugeot',
            //     model: '205',
            //     owner: 'Michel',
            // },
            // {
            //     color: 'white',
            //     make: 'Chery',
            //     model: 'S22L',
            //     owner: 'Aarav',
            // },
            // {
            //     color: 'violet',
            //     make: 'Fiat',
            //     model: 'Punto',
            //     owner: 'Pari',
            // },
            // {
            //     color: 'indigo',
            //     make: 'Tata',
            //     model: 'Nano',
            //     owner: 'Valeria',
            // },
            // {
            //     color: 'brown',
            //     make: 'Holden',
            //     model: 'Barina',
            //     owner: 'Shotaro',
            // },
        ];

        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'car';
            await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
            console.info('Added <--> ', cars[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async createCar(ctx, carNumber, name, type, cash_out, cash_in, employee, origin) {
        console.info('============= START : Create Car ===========');

        const car = {
            name,
            type,
            cash_out,
            cash_in,
            employee,
            origin
        };

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');
    }

    async queryAllCars(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeCarOwner(ctx, carNumber, newName, newType, newCash_out, newCash_in, newEmployee, newOrigin) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.name = newName;
        car.type = newType;
        car.cash_out = newCash_out;
        car.cash_in = newCash_in;
        car.employee = newEmployee;
        car.origin = newOrigin

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = FabCar;
