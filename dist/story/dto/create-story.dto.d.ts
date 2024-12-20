declare class SpecialMomentDto {
    title: string;
    date: string;
    description: string;
    photoFile?: any;
}
export declare class CreateStoryDto {
    coupleName: string;
    message: string;
    relationshipStartDate: string;
    relationshipStartTime: string;
    selectedPlan: string;
    specialMoments: SpecialMomentDto[];
    youtubeUrl: string;
    storyImages: any;
}
export {};
