export const findAllCompanies = async (databasePrisma, req, res) => {
  databasePrisma.company
    .findMany({
      include: {
        listings: true,
        admin: true,
      },
    })
    .then((companies) => {
      res.send(companies);
    });
};
