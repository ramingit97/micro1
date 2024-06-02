import { NextFunction, Request, Response, Router } from 'express';
const router = Router();
import { Client } from 'minio';
import sharp from "sharp"
import multer from "multer";
const minioClient = new Client({
    endPoint: '192.168.32.2',
    port: 9000,
    useSSL: false ,
    accessKey: 'PNni4to6nt9ys7NR8h42',
    secretKey: 'Gfc5FrUOisopBjzoyAchEKBtvgnl9yAMIr0fwUu3',
});

const upload = multer();

router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buckets = await minioClient.listBuckets();
    console.log('Buckets list:', buckets);
    res.json(buckets);
  } catch (error) {
    console.log('err',error);
    next(error);
  }
});


router.post('/add',upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('rq',req.body);
    res.status(201).json({ura:true});
  } catch (error) {
    next(error);
  }
});



router.post('/upload',upload.array('files', 10), async (req, res) => {
  try { 
    let files = req.files;
    console.log(files)
    console.log('req',req.body);
    // const files = [];
    // console.log('files',files)
    // return;
    // return;
    // Получение информации о загруженном файле
    let promises = files.map(async (file)=>{
       return await uploadFiles(file);
    })
    let result = await Promise.all(promises);
    console.log('All files is uploaded',result);
    
  // Отправка URL-адресов в ответе клиенту
   res.status(200).json(result);
  } catch (error) {
    console.error('Error uploading image111:', error);
    res.status(500).send('Error uploading image');
  }
});

router.get('/presignedUrl', async (req, res) => {
  try {
    const objectsStream = minioClient.listObjectsV2('bucket-test', '', true, '');
    let objects = [];
    objectsStream.on('data', function (obj) {
      objects.push(obj);
    });
    objectsStream.on('end', async function () {
      try {
        // Генерация предподписанных URL для всех объектов
        const presignedUrls = await Promise.all(objects.map(async (obj) => {
          const presignedUrl = await minioClient.presignedGetObject('bucket-test', obj.name, 24 * 60 * 60);
          return { objectName: obj.name, presignedUrl };
        }));
        res.status(200).json(presignedUrls);
      } catch (e) {
        console.error('Error generating presigned URLs:', e);
        res.status(500).send('Error generating presigned URLs');
      }
    });
    objectsStream.on('error', function (e) {
      console.error('Error listing objects:', e);
      res.status(500).send('Error listing objects');
    });
  } catch (e) {
    console.error('Error in /presignedUrl route:', e);
    res.status(500).send('Error in /presignedUrl route');
  }
});


async function uploadFiles(file){
  const { originalname, buffer } = file;


  //   Уменьшение размера изображения с помощью Sharp
    const resizedImageBuffer = await sharp(buffer)
      .resize({ width: 800 }) // Уменьшаем ширину до 800 пикселей
      .toBuffer();

    // // Загрузка оригинального изображения в MinIO

    await minioClient.putObject('bucket-test', `original/${originalname}`, buffer);

    // Загрузка уменьшенного изображения в MinIO
    const result = await minioClient.putObject('bucket-test', `resided/resized_${originalname}`, resizedImageBuffer);
    // console.log("vseeee")
    // const originalUrl = await minioClient.presignedGetObject('bucket-test', originalname, 24 * 60 * 60); // 24 часа
    // const resizedUrl = await minioClient.presignedGetObject('bucket-test', `resized_${originalname}`, 24 * 60 * 60); // 24 часа
    // console.log(originalUrl,resizedUrl);
    // return {originalUrl,resizedUrl}
    console.log('result',result);
    return result;
}

export default router;