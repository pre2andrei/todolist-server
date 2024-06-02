import { Category } from "@prisma/client";
import express, { Request, Response } from "express";

import PrismaInstance from "../prismaClient";
import { isValidCategory, isValidName } from "../validation";

const categoriesRouter = express.Router();
const prisma = PrismaInstance.getInstance();

categoriesRouter.get("/categories", async (req: Request, res: Response) => {
  const data = await prisma.category.findMany({
    include: { items: true, _count: true },
  });
  return res.status(200).json(data);
});

categoriesRouter.post("/editCategory", async (req: Request, res: Response) => {
  const { name, id } = req.body;
  if (!isValidName(name))
    return res.status(400).json({ message: "Invalid Category Data" });
  try {
    let category = await prisma.category.findFirst({
      where: { id },
    });

    if (!category)
      return res.status(400).json({ message: "Category not found" });

    category = await prisma.category.update({
      data: { name },
      where: { id },
      include: { items: true },
    });

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: "Error on the server" });
  }
});

categoriesRouter.post("/addCategory", async (req: Request, res: Response) => {
  if (!isValidCategory(req.body))
    return res.status(400).json({ message: "Invalid Category Data" });

  const { name, order } = req.body;

  try {
    const category = await prisma.category.create({
      data: { name, order },
      include: { items: true },
    });

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: "Error on the server" });
  }
});

categoriesRouter.post(
  "/deleteCategory",
  async (req: Request, res: Response) => {
    const { categoryId } = req.body;

    try {
      let category = await prisma.category.findFirst({
        where: { id: categoryId },
      });

      if (!category)
        return res.status(400).json({ message: "Category not found" });

      await prisma.item.deleteMany({ where: { category_id: categoryId } });

      category = await prisma.category.delete({
        where: { id: categoryId },
      });

      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json({ message: "Error on the server" });
    }
  }
);

categoriesRouter.post(
  "/setOrderCategories",
  async (req: Request, res: Response) => {
    const categoryIds: string[] = req.body.categoryIds;

    try {
      if (!categoryIds)
        return res.status(400).json({ message: "No Data Provided" });
      if (categoryIds.length == 0)
        return res.status(400).json({ message: "No Data Provided" });

      const newCategories: Category[] = [];

      for (let i = 0; i < categoryIds.length; i++) {
        const id = categoryIds[i];

        const category = await prisma.category.findFirst({ where: { id } });
        if (!category)
          return res
            .status(400)
            .json({ message: "One category was not found" });

        newCategories.push(
          await prisma.category.update({
            where: { id },
            data: { order: i },
            include: { items: true },
          })
        );
      }

      return res.status(200).json(newCategories);
    } catch (error) {
      return res.status(500).json({ message: "Error on the server" });
    }
  }
);

export default categoriesRouter;
