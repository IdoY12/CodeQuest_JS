import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { avatarS3Bucket, avatarS3Endpoint, avatarS3Region, s3Client } from "../aws/s3Client.js";
export function getAvatarBucketName() {
    return avatarS3Bucket;
}
export function getAvatarPublicUrl(key) {
    if (avatarS3Endpoint) {
        return `${avatarS3Endpoint}/${avatarS3Bucket}/${key}`;
    }
    return `https://${avatarS3Bucket}.s3.${avatarS3Region}.amazonaws.com/${key}`;
}
export function extractAvatarKeyFromUrl(url) {
    try {
        const parsed = new URL(url);
        if (avatarS3Endpoint) {
            const endpointHost = new URL(avatarS3Endpoint).host;
            if (parsed.host !== endpointHost)
                return null;
            const path = parsed.pathname.replace(/^\/+/, "");
            const prefix = `${avatarS3Bucket}/`;
            if (!path.startsWith(prefix))
                return null;
            return path.slice(prefix.length);
        }
        const virtualHost = `${avatarS3Bucket}.s3.${avatarS3Region}.amazonaws.com`;
        if (parsed.host === virtualHost) {
            return parsed.pathname.replace(/^\/+/, "") || null;
        }
        return null;
    }
    catch {
        return null;
    }
}
export async function createAvatarUploadUrl(params) {
    return getSignedUrl(s3Client, new PutObjectCommand({
        Bucket: avatarS3Bucket,
        Key: params.key,
        ContentType: params.contentType,
    }), { expiresIn: 60 * 5 });
}
export async function deleteAvatarObject(key) {
    await s3Client.send(new DeleteObjectCommand({
        Bucket: avatarS3Bucket,
        Key: key,
    }));
}
