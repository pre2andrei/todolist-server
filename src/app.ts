import { Measurement } from "@prisma/client";
import express, { Request, Response } from "express";

import corsOptions from "./config/corsOptions";
import PrismaInstance from "./prismaClient";
import categoriesRouter from "./routers/categoriesRouter";
import itemsRouter from "./routers/itemsRouter";

const prisma = PrismaInstance.getInstance();
const cors = require("cors");

const app = express();
const port = process.env.PORT;

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/seed", async (req: Request, res: Response) => {
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();

  const MAX_CATEGORIES_NR = 8;
  const MAX_ITEMS_NR = 8;
  const MAX_QUANTITY = 9;

  const possibleCategories = ["Cumpărături", "Curățenie", "Plimbă Cainele"];
  const possibleItems = [
    "Pâine",
    "Ouă",
    "Lapte",
    "Salam",
    "Brânză",
    "Iaurt",
    "Smântână",
    "Șuncă Presată",
  ];

  const categoriesNr = Math.round(Math.random() * MAX_CATEGORIES_NR + 1);

  for (let i = 0; i < categoriesNr; i++) {
    const categoryName =
      possibleCategories[Math.floor(Math.random() * possibleCategories.length)];
    const category = await prisma.category.create({
      data: { name: categoryName, order: i },
    });

    if (categoryName == possibleCategories[0]) {
      const itemsNr = Math.round(Math.random() * MAX_ITEMS_NR + 1);
      for (let j = 0; j < itemsNr; j++) {
        const itemName =
          possibleItems[Math.floor(Math.random() * possibleItems.length)];
        let measurement: Measurement = "G";
        if (itemName == "Pâine" || itemName == "Ouă") measurement = "COUNT";
        else if (itemName == "Lapte") measurement = "ML";

        let quantity = Math.round(Math.random() * MAX_QUANTITY + 1);
        if (measurement != "COUNT") quantity *= 100;

        await prisma.item.create({
          data: {
            order: j,
            name: itemName,
            measurement,
            quantity,
            category_id: category.id,
          },
        });
      }
    }
  }

  res.sendStatus(200);
});

app.use(categoriesRouter);
app.use(itemsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
  console.log(`http://localhost:${port}/seed`);
});
