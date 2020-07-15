export interface ServiceResult {
    success: boolean;
    data: any;
    error: any;
  }
  
  export type ServiceParams = any;
  export type ValueOrPromise<T> = PromiseLike<T> | T;
  
  export interface ServiceFn {
    (params: ServiceParams): ValueOrPromise<ServiceResult>;
  }
  
  export type HookResult = [boolean, any, any];
  
  export default function useDataService(
    service: ServiceFn,
    params: ServiceParams,
  ): HookResult {}
  