import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';


@Injectable()
export class FilesService {

    async uploadFile(file): Promise<string> {
        try {
            const fileName: string = uuid.v4() + path.parse(file.originalname).ext;
            // const filePath: string = path.resolve(__dirname, '../../../', 'front/spa/client/src/assets');
            const filePath: string = path.resolve(__dirname, '..', 'assets/avatars');
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true});
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer);
            return process.env.VUE_APP_ROOT_API + '/' + fileName;
        } catch (e) {
            throw  new HttpException('Image upload error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
