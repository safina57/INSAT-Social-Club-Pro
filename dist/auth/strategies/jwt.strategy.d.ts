import { Strategy } from 'passport-jwt';
import { JwtPayload } from './../jwt-payload.interface';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersService;
    constructor(usersService: UsersService, config: ConfigService);
    validate(payload: JwtPayload): Promise<any>;
}
export {};
