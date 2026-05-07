import { Request, Response } from 'express';
import Product from '../models/Product';
import { isDbConnected, mockData, saveMockData } from '../utils/mockStore';

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDbConnected()) {
      const newProduct = {
        _id: `mock_prod_${Date.now()}`,
        ...req.body,
        createdAt: new Date()
      };
      mockData.products = mockData.products || [];
      mockData.products.push(newProduct);
      saveMockData();
      res.status(201).json({ success: true, data: newProduct });
      return;
    }

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDbConnected()) {
      const data = mockData.products || [];
      res.status(200).json({ success: true, data });
      return;
    }

    const products = await Product.find();
    res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDbConnected()) {
      mockData.products = (mockData.products || []).filter((p: any) => p._id !== req.params.id);
      saveMockData();
      res.status(200).json({ success: true, message: 'Product deleted' });
      return;
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
