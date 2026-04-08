export const isAdmin = (member, userId) => {
    const roleCheck = member.roles.cache.some(
        role => role.name === 'Admin'
    )

    const ownerCheck = userId === process.env.ADMIN_ID

    return roleCheck || ownerCheck
}