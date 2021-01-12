import SenseyeApiClient, { HOST, BASE_PATH } from './ApiClient';
import { Constants as ModelConstants, Session, Survey, Video } from './models';

export const Constants = {
  Api: {
    HOST: HOST,
    BASE_PATH: BASE_PATH,
  },
  ...ModelConstants,
};
export const Models = {
  Session: Session,
  Survey: Survey,
  Video: Video,
};

export { SenseyeApiClient };

export * from './models/types';
export * from './types';
