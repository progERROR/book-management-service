import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Service {
  private readonly logger = new Logger(AwsS3Service.name);
  private readonly s3: S3;
  private readonly bucketName;

  constructor(
    private configService: ConfigService
  ) {
    this.s3 = new S3();
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME');
  }

  public async uploadBookContent(content: string): Promise<string> {
    try {
      const uploadedResult = await this.s3.upload({
        Bucket: this.bucketName,
        Body: content,
        Key: `${Date.now()}.txt`
      }).promise();

      return uploadedResult.Key;
    } catch (error) {
      this.logger.error('Error while uploading book content:', error.message)
      throw new InternalServerErrorException('Error while uploading book content')
    }
  }

  public async getFileContent(fileKey: string): Promise<string> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: fileKey,
      };

      const data = await this.s3.getObject(params).promise();

      if (!data.Body) {
        throw new NotFoundException("Book content was not found");
      }

      return data.Body.toString();
    } catch (error) {
      this.logger.error("Error fetching file:", error);
      throw error;
    }
  }
}
