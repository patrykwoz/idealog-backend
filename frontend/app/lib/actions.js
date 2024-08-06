'use server'

import { signIn, signOut, auth } from '@/auth'
import { redirect } from 'next/navigation'
import { revalidatePath, revalidateTag } from 'next/cache'
import {
    updateUserApi,
    fetchIdeas,
    createIdeaApi,
    fetchRelationships,
    createRelationshipApi,
    fetchNodes,
    fetchNode,
    createKnowledgeApi,
} from '@/app/client/api_actions'

export async function login(formData) {
    try {
        const signinObj = {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,
        };

        await signIn("credentials", signinObj);

    } catch (error) {
        if (error) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                case 'CallbackRouteError':
                    return 'Access token not found.'
                case 'Bad Request':
                    return 'User not found.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
    redirect('/workspace');
}

export async function logout() {
    try {
        await signOut({ redirect: false })
    } catch (error) {
        console.log(error)
        throw error
    }
    redirect('/auth/login');
}

export async function updateUser(formData) {
    const rawFormData = {
        full_name: formData.get('userFullName'),
        email: formData.get('userEmail'),
        image_url: formData.get('userImageUrl'),
    }

    const autObj = await auth();
    const accessToken = autObj.accessToken;

    try {
        await updateUserApi(accessToken, rawFormData)
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

export async function currentUser() {
    const autObj = await auth();
    console.log(autObj);
}


export async function getIdeas() {
    const autObj = await auth();
    const accessToken = autObj.accessToken;

    try {
        const ideas = await fetchIdeas(accessToken)
        return ideas
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

export async function createIdea(formData) {
    const rawFormData = {
        name: formData.get('ideaName'),
        description: formData.get('ideaDescription'),
    }
    const autObj = await auth();
    const accessToken = autObj.accessToken;

    try {
        const idea = await createIdeaApi(accessToken, rawFormData)
        revalidateNodes();
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

export async function getRelationships() {
    try {
        const relations = await fetchRelationships()
        return relations
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

export async function createRelationship(formData) {
    const rawFormData = {
        name: formData.get('relationshipName'),
        head: formData.get('relationshipHead'),
        tail: formData.get('relationshipTail'),
        rel_type: formData.get('relationshipType'),
    }

    const autObj = await auth();
    const accessToken = autObj.accessToken;
    try {
        const relation = await createRelationshipApi(accessToken, rawFormData)
        revalidateNodes();
        return relation
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

export async function createKnowledge(formData) {
    const rawFormData = {
        name: formData.get('knowledgeTitle'),
        url: formData.get('knowledgeUrl'),
        summary: formData.get('knowledgeSummary'),
        full_text: formData.get('knowledgeText'),
        use_ml: formData.get('useMl') === 'on',
    }

    const autObj = await auth();
    const accessToken = autObj.accessToken;
    try {
        const knowledge = await createKnowledgeApi(accessToken, rawFormData)
        revalidateNodes();
        return knowledge
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

export async function getNodes(queryParams = {}) {
    const autObj = await auth();
    const accessToken = autObj.accessToken;

    try {
        const nodes = await fetchNodes(accessToken, queryParams)
        return nodes
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

export async function getNode(neo4jId) {
    const autObj = await auth();
    const accessToken = autObj.accessToken;
    try {
        const node = await fetchNode(accessToken, neo4jId)
        return node[0]
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

export async function searchNodes(value) {
    const autObj = await auth();
    const accessToken = autObj.accessToken;

    const queryParams = {
        search: value,
    }

    try {
        const nodes = await fetchNodes(accessToken, queryParams)
        return nodes
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

export async function revalidateNodes() {
    revalidateTag('nodes');
}

export async function revalidateRelationships() {
    revalidateTag('relationships');
}