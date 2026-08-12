import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "fileName and fileType are required" },
        { status: 400 },
      );
    }

    const region = process.env.AWS_REGION || "us-east-1";
    const bucketName = process.env.AWS_S3_BUCKET_NAME || "vaultly-receipts";

    const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `receipts/${userId}/${Date.now()}-${cleanFileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });
    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

    return NextResponse.json({ uploadUrl, fileUrl, key });
  } catch (error) {
    console.error("Presigned URL generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned upload URL" },
      { status: 500 },
    );
  }
}
