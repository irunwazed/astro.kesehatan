

type MFA_STATUS_TYPE = {
    DRAFT: 0,
    COMMIT: 1,
    ROLLBACK: 2
}
export const MFA_STATUS: MFA_STATUS_TYPE = {
    DRAFT: 0, // ubah secret
    COMMIT: 1, // ubah secret
    ROLLBACK: 2 // kembalikan secret
}