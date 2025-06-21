import sql from "@/lib/db";
import { Project, ProjectNode } from "@/lib/definitions";


/**
 * Fetches all projects from the database and constructs a hierarchical tree structure
 * of projects and their sub-projects up to a maximum depth of 5 levels.
 *
 * Each project node may contain a `subProject` property, which is an array of its direct sub-projects,
 * or `null` if there are no sub-projects or the maximum depth is reached.
 *
 * @returns {Promise<ProjectNode[]>} A promise that resolves to an array of root project nodes,
 * each with their nested sub-projects.
 */
export async function fetchProjects() {
    const allProjects = await sql<ProjectNode[]>`
        SELECT ${sql("id", "name", "createdAt", "lastModifiedAt", "level", "parentProjectId")} FROM projects
    `

    function findSubProjects(projectId: string, level: number): ProjectNode[] | null {
        if (level === 5) {
            return null;
        }

        const subProjects: ProjectNode[] = allProjects.filter(project => project.parentProjectId === projectId);
        if (!subProjects) {
            return null;
        }

        const result = subProjects.map((subProject) => {
            subProject.subProjects = findSubProjects(subProject.id, level + 1);
            return subProject;
        })
        return result;
    }

    // get root projects
    const projectTree = allProjects.filter(project => project.parentProjectId == null);
    // for each root project, find its subprojects
    for (let i = 0; i < projectTree.length; i++) {
        projectTree[ i ].subProjects = findSubProjects(projectTree[ i ].id, 1);
    }

    sortProjectTree(projectTree);
    return projectTree;
}

// Sort project tree by name
function sortProjectTree(tree: ProjectNode[] | null) {
    if (!tree) {
        return;
    }
    tree.sort((a: ProjectNode, b: ProjectNode) => a.name.localeCompare(b.name));
    for (let i = 0; i < tree.length; i++) {
        sortProjectTree(tree[ i ].subProjects)
    }
}