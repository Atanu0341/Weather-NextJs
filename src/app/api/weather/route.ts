import { NextRequest, NextResponse } from "next/server";

export async function GET(request: any) {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const latitude = searchParams.get('lat')
    const longitude = searchParams.get('lon')

    let url = ""
    if (address) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${process.env.NEXT_WEATHER_URL}`
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_WEATHER_URL}`
    }

    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json({ data })
}