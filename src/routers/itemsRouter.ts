import { Item } from "@prisma/client";
import express, { Request, Response } from "express";

import PrismaInstance from "../prismaClient";
import { isValidItem } from "../validation";

const itemsRouter = express.Router();
const prisma = PrismaInstance.getInstance();

itemsRouter.post("/check", async (req: Request, res: Response) => {
  const { itemId, isChecked } = req.body;
  try {
    let item = await prisma.item.findFirst({
      where: { id: itemId },
    });

    if (!item) return res.status(400).json({ message: "Item not found" });

    item = await prisma.item.update({
      data: { checked: isChecked },
      where: { id: itemId },
    });

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: "Error on the server" });
  }
});
itemsRouter.post("/addItem", async (req: Request, res: Response) => {
  console.log("addItem", req.body);

  if (!isValidItem(req.body))
    return res.status(400).json({ message: "Invalid Item Data" });

  const { name, measurement, quantity, categoryId, order } = req.body;
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category)
      return res.status(400).json({ message: "Category not found" });

    const item = await prisma.item.create({
      data: {
        order,
        name,
        measurement,
        quantity: quantity ? +quantity : 0,
        category_id: categoryId,
      },
    });

    return res.status(200).json(item);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Error on the server" });
  }
});
itemsRouter.post("/deleteItem", async (req: Request, res: Response) => {
  const { itemId } = req.body;

  if (!itemId) return res.status(400).json({ message: "Item not specified" });
  try {
    let item = await prisma.item.findFirst({
      where: { id: itemId },
    });

    if (!item) return res.status(400).json({ message: "Item not found" });

    item = await prisma.item.delete({
      where: { id: itemId },
    });
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: "Error on the server" });
  }
});

itemsRouter.post("/editItem", async (req: Request, res: Response) => {
  if (!isValidItem(req.body))
    return res.status(400).json({ message: "Invalid Item Data" });

  const { itemId, name, quantity, measurement } = req.body;
  try {
    let item = await prisma.item.findFirst({
      where: { id: itemId },
    });

    if (!item) return res.status(400).json({ message: "Item not found" });

    item = await prisma.item.update({
      where: { id: itemId },
      data: {
        name,
        quantity: quantity ? +quantity : 0,
        measurement,
      },
    });

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: "Error on the server" });
  }
});
itemsRouter.post("/setOrderItems", async (req: Request, res: Response) => {
  const itemsIds: string[] = req.body.itemsIds;

  try {
    if (!itemsIds) throw "No Data Provided";
    if (itemsIds.length == 0) throw "No Data Provided";

    const newItems: Item[] = [];

    for (let i = 0; i < itemsIds.length; i++) {
      const id = itemsIds[i];
      newItems.push(
        await prisma.item.update({
          where: { id },
          data: { order: i },
        })
      );
    }

    return res.status(200).json(newItems);
  } catch (error) {
    return res.status(500).json({ message: "Error on the server" });
  }
});
export default itemsRouter;
