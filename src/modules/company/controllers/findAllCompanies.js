export const findAllCompanies = async (databasePrisma, req, res) => {
  databasePrisma.company
    .findMany({
      include: {
        applications: true,
        offers: true,
        listings: true,
        admin: true,
      },
    })
    .then((companies) => {
      res.send(companies);
    });
};
