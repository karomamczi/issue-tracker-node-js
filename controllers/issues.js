exports.getIssues = (req, res, next) => {
  const issues = [
    {
      title: 'Issue 1',
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      status: 'open',
    },
    {
      title: 'Issue 2',
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      status: 'pending',
    },
    {
      title: 'Issue 3',
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      status: 'closed',
    }
  ];
  res.render('issue-tracker', {
    issues,
  });
};
