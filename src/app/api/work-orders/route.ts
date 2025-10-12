import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'

const COLLECTION_NAME = 'workOrders'

// GET → fetch all work orders
export async function GET() {
    try {
        const snapshot = await getDocs(collection(db, COLLECTION_NAME))
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch work orders' }, { status: 500 })
    }
}

// POST → create a new work order
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...body,
            createdAt: new Date().toISOString(),
            status: body.status || 'Pending'
        })
        return NextResponse.json({ id: docRef.id, ...body }, { status: 201 })
    } catch {
        return NextResponse.json({ error: 'Failed to create work order' }, { status: 500 })
    }
}

// PUT → update an existing work order
export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { id, ...data } = body
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

        const ref = doc(db, COLLECTION_NAME, id)
        await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })

        return NextResponse.json({ id, ...data })
    } catch {
        return NextResponse.json({ error: 'Failed to update work order' }, { status: 500 })
    }
}

// DELETE → delete a work order
export async function DELETE(req: Request) {
    try {
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

        await deleteDoc(doc(db, COLLECTION_NAME, id))
        return NextResponse.json({ id, success: true })
    } catch {
        return NextResponse.json({ error: 'Failed to delete work order' }, { status: 500 })
    }
}
