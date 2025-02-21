import express from 'express'
import { saveProducteInfo } from 'models/productes';
import upload from 'helpers/uploads';

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