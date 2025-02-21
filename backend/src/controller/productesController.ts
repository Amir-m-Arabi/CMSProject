import express from 'express'
import { getProducteInfo, getProducteInfoById, saveProducteInfo , deleteProducteInfo , updateProducteInfo } from 'models/productes';
import upload from 'helpers/uploads';
import path from 'path'
import fs from 'fs'

export const saveProductesInfo = async (req:express.Request , res:express.Response):Promise<any> =>{
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.log('Error:', err);
            return res.status(400).json({ message: 'خطا در آپلود فایل', error: err.message });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ message: 'هیچ فایلی ارسال نشده است.' });
            }

            const { adminName , producteName , inventory , productePrice} = req.body;
            console.log(`/uploads/${req.file.filename}`);
            const imageUrl = `/uploads/${req.file.filename}`;

            const image = await saveProducteInfo({ adminName , producteName , inventory , productePrice , imageUrl });

            return res.status(200).json({ message: 'تصویر با موفقیت آپلود شد!', image });
        } catch (error) {
            console.error('خطا در ذخیره تصویر:', error);
            return res.status(500).json({ message: 'خطا در ذخیره اطلاعات تصویر', error: error.message });
        }
    });
}

export const getProdutesInfoByAdminName = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
        const { adminName } = req.params;

        const images = await getProducteInfo(adminName);

        if (images.length === 0) {
            return res.status(404).json({ message: 'محصولی موجو نمیباشد' });
        }

        return res.status(200).json({ images });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'محصول یافت نشد', error: error.message });
    }
};

export const deleteProdutse = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      const { id } = req.body;
      
      const image = await getProducteInfoById(id);
      if (!image) {
        return res.status(404).json({ message: 'محصول مورد نظر یافت نشد.' });
      }
  
      const uploadsDir = path.join(__dirname, '../uploads');
      const fileName = path.basename(image.imageUrl);
      const filePath = path.join(uploadsDir, fileName);
  
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
  
      await deleteProducteInfo(id);
  
      return res.status(200).json({ message: 'تصویر و تمامی اطلاعات مربوط به آن با موفقیت حذف شدند.' });
    } catch (error: any) {
      console.error("خطا در حذف تصویر:", error);
      return res.status(500).json({ message: 'خطا در حذف تصویر', error: error.message });
    }
  };

  export const updateProductes = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      const { id, ...updateData } = req.body;
  
      // دریافت اطلاعات محصول با شناسه
      const product = await getProducteInfoById(id);
      if (!product) {
        return res.status(404).json({ message: 'محصول مورد نظر یافت نشد.' });
      }
  
      // بررسی آپلود فایل جدید
      if (req.file) {
        // مسیر پوشه uploads
        const uploadsDir = path.join(__dirname, '../uploads');
        // استخراج نام فایل قدیمی از مسیر ذخیره شده در محصول
        const oldFileName = path.basename(product.imageUrl);
        const oldFilePath = path.join(uploadsDir, oldFileName);
        // حذف فایل قدیمی در صورت وجود
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
        // اضافه کردن مسیر فایل جدید به داده‌های به‌روزرسانی
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }
  
      // به‌روزرسانی تنها فیلدهایی که در updateData قرار دارند
      const updatedProduct = await updateProducteInfo(id , { $set: updateData });
  
      return res.status(200).json({ message: 'به‌روزرسانی با موفقیت انجام شد.', product: updatedProduct });
    } catch (error) {
      console.error('خطا در به‌روزرسانی:', error);
      return res.status(500).json({ message: 'خطا در به‌روزرسانی اطلاعات', error: error.message });
    }
  };
  
