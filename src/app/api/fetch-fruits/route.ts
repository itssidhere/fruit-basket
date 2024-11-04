import { validateFruitArray } from "@/app/utils/validation";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const apiUrl = process.env.API_URL;
        if (!apiUrl) {
          throw new Error('API URL is not defined');
        }
        const response = await fetch(apiUrl);
        const data = await response.json();

        
        if (!validateFruitArray(data)) {
          throw new Error('Invalid data format received from API');
        }
        
        return NextResponse.json(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
      }
}
