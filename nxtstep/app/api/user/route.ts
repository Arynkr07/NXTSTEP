import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  await dbConnect(); // Connect to MongoDB
  return NextResponse.json({ message: "Connected to MongoDB for NxtStep!" });
}