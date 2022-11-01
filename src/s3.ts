import { S3 } from '@aws-sdk/client-s3'
import assert from "assert"

assert(process.env.XCM_S3_ACCESS_KEY_ID, 'XCM_S3_ACCESS_KEY_ID env variable must be set')
assert(process.env.XCM_S3_SECRET_ACCESS_KEY, 'XCM_S3_SECRET_ACCESS_KEY env variable must be set')


export const s3: S3 = new S3({
    region: process.env.XCM_S3_REGION,
    endpoint: process.env.XCM_S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.XCM_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.XCM_S3_SECRET_ACCESS_KEY
    }
})