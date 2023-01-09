# Industry Knowledge CA - Design Brief

Noroff has requested a job agency web application to allow for students to interact with industry partners to find placements. As a member of the design team your role will involve User Journey planning, User Experience and Interaction Design.

Under real world working conditions a project of this scope would be allocated more than 2 weeks of design attention, in fact the design phase would be finished by the time that development begins. With this in mind, we will be structuring our work carefully to avoid roadblocks and to ensure that the whole team can get working even if the design is not completed. This is done using phases, which we explain below.

### Phase One - Low Fi

The first phase of this project will be low-fidelity wireframing to define the User Journey and to help development planning. This phase should be completed before the end of the first week. These wireframes should not represent the final design but simply organise the necessary components of the application. Once low fi wireframes are completed and handed over to the development teams, the design team can move onto the next phase.

### Phase Two - Hi Fi

The next steps will be to produce high fidelity design assets, a style guide, optional animation guide and the provision of any required graphics such as images or digital art. By staggering these phases, the development teams should have time to create the functional structure of the site, and finish this off with a detailed design and styling round towards the end.

### Phase Three - Assistance

With these assets handed over to the development teams, the design team should be available to assist developers with styling and interpretation of design files. There is also an opportunity to plan for future features that will be carried out by class groups in the future.

## Approach

Meet as a team to discuss the project goals and generate work items. As the only team without a scrum master you may choose to elect a Team Lead to act as your representative to the Product Owners. Once you have generated the work items, distribute these amongst your team. You should aim to balance these items as best as possible, but they will not always be equal.

Once you have completed all of your work items check with your team if there are any outstanding items you could work on. If there is no remaining work you may proceed to assist other teams with quality assurance or with the development of future features.

## Tooling

All work should be done using the shared Team Project on Figma. You should be able to access the project using the link below:

[Team Invite](https://www.figma.com/team_invite/redeem/rUtvliWUCyEWu1aFubq3hX)
[Project Invite](https://www.figma.com/files/project/78324144/agency.noroff.dev?fuid=1194169844201401532)

Please strive to name your files and components in a way that is easy to understand. It is common to match up the name of a component with the CSS class used to style it. This approach allows for an effortless design review working component by component to check accuracy.

### List of Views

1. Public - Home
2. Public - Listing
3. Public - Listings
4. Public - Authentication
5. Public - Profile
6. Admin - Listings
7. Admin - Offers
8. Admin - Applications
9. Admin - Users

Applications and Offers will both be exposed in the Listing and Profile views respectively. In the Profile View offers sent and received should be displayed in a mailbox. In the Listing View applications sent and received should be displayed depending on the user role context.

Admin users require a table view to manage all listings, offers and applications and users. As this is not public facing design fidelity is less important however it must be functional. (Examples, Figma Studio, Strapi, etc).

Note that each of these views has various states, for example, Authentication can be used to register, login and potentially reset password.

## Deliverables

- [ ] Low Fi Wireframes for all views
- [ ] Style Guide / Design System
- [ ] High Fi Wireframes for all views