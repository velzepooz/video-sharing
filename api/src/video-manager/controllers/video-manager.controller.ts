import {
  Controller, Delete, Get, HttpCode, HttpStatus, Param,
  Post, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ROUTES } from '../../shared/config/routes';
import { VideoManagerService } from '../services/video-manager.service';
import { videoFileValidator } from '../helpers/video-file-validator.helper';
import { FileInterface } from '../../shared/interfaces/file.interface';
import { VideoDto } from '../dto/out/video.dto';
import { IdParamDto } from '../dto/in/id-param.dto';
import { ResponseInterface } from '../../shared/interfaces/response.interface';

@Controller(ROUTES.VIDEO.MAIN)
export class VideoManagerController {
  constructor(
    private readonly _videoManagerService: VideoManagerService,
  ) {}

  @Post(ROUTES.VIDEO.UPLOAD)
  @UseInterceptors(FileInterceptor(
    'file',
    {
      fileFilter: videoFileValidator,
    },
  ))
  async uploadNewVideo(@UploadedFile() file: FileInterface): Promise<VideoDto> {
    return this._videoManagerService.uploadNewVideo(file.buffer, file.originalname);
  }

  @UsePipes(new ValidationPipe())
  @Delete(ROUTES.VIDEO.ID)
  async deleteVideo(@Param() { id }: IdParamDto): Promise<void> {
    return this._videoManagerService.deleteVideo(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Get(ROUTES.VIDEO.ID)
  async getVideo(
    @Param() { id }: IdParamDto,
    @Headers() headers,
    @Res() res: ResponseInterface,
  ) {
    const videoStream = await this._videoManagerService.getVideoStream(id);

    res.setHeader('Accept-Ranges', 'bytes');

    videoStream.stream.pipe(res);
  }

  @Get()
  async getAllVideos() {
    return this._videoManagerService.getAllVideos();
  }
}
