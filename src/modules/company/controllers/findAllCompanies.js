export const findAllCompanies = async (databasePrisma, req, res) => {
  databasePrisma.company
    .findMany({
      include: {
        listings: true,
        admin: {
          select: {
            id: true,
            title: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            avatar: true,
            about: true,
          },
        },
      },
    })
    .then((companies) => {
      res.send(companies);
    });
};
