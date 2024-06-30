import 'reflect-metadata';
import { injectable } from 'inversify';
import { HttpContext, injectHttpContext } from 'inversify-express-utils';

@injectable()
export abstract class BaseController {
  @injectHttpContext private readonly _httpContext: HttpContext;
}
