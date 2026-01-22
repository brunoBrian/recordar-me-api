import { Module } from "@nestjs/common";
import { StoryController } from "./story.controller";
import { StoryService } from "./story.service";
import { FirebaseService } from "../shared/services/firebase.service";
import { StorageService } from "../shared/services/storage.service";
import { MulterMainModule } from "../multer/app.module";

@Module({
  controllers: [StoryController],
  imports: [MulterMainModule],
  providers: [StoryService, FirebaseService, StorageService],
})
export class StoryModule {}
