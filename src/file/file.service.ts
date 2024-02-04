import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import * as FormData from 'form-data';
import FormData from "form-data"
@Injectable()
export class FileService {
  constructor(private readonly httpService: HttpService) {}

  async uploadImageFile(
    file: Express.Multer.File,
    link: string,
  ): Promise<string> {
    try {
      if (file.mimetype.includes('image')) {
        const formData = new FormData();
        formData.append('image', file.buffer, file.filename + this.randomCode(5));

        const uploadFile = await this.httpService.axiosRef.post(link, formData);
        return uploadFile.data.data.display_url;
      }
      throw new BadRequestException('Incorrect image type');
    } catch (error) {
      throw new BadRequestException('Incorrect image type');
    }
  }

  private randomCode(len: number): string {
    var code = '';

    for (let i = 0; i < len; i++) {
      var randomNumber = (Math.random() * 10) << 0;
      code += String.fromCharCode(
        (randomNumber += randomNumber > 9 ? (randomNumber < 36 ? 55 : 61) : 48),
      );
    }

    return code;
  }
}
