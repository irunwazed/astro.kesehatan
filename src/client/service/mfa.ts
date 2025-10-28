import {  GET, POST } from "../service";


export const MFAService = {
    setMFAGroup: (body: {group_id:string}) => POST({ url: "/api/group/mfa", body: body }),
    setRollbackMFAGroup: (body: {group_id:string}) => POST({ url: "/api/group/mfa/rollback", body: body }),
    getMyOTP: () => GET<{otp:string}>({ url: "/api/user/otp"}),
    getOTP: (body: {group_id:string}) => GET<{otp:string}>({ url: "/api/group/otp?group_id="+body.group_id}),
}