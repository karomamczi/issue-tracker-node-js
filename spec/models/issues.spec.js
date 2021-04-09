const Issue = require('../../models/issue');
const fs = require('fs');

describe('Issue Model', () => {
  describe('Resolve data response', () => {
    it('should resolve with empty array when error is passed', async () => {
      const resolve = jasmine.createSpy();

      Issue.resolveDataResponse('Error', null, resolve);

      expect(resolve).toHaveBeenCalledOnceWith([]);
    });

    it('should resolve with parsed data when there is no error', () => {
      const resolve = jasmine.createSpy();

      Issue.resolveDataResponse(
        null,
        '[{"id": "id", "title": "test", "description": "test", "status": "open"}]',
        resolve
      );

      expect(resolve).toHaveBeenCalledWith([
        {
          id: 'id',
          title: 'test',
          description: 'test',
          status: Issue.STATUS.OPEN,
        },
      ]);
    });
  });

  describe('Fetch all', () => {
    it('should get issues from file', async () => {
      const expectedIssues = [
        {
          id: 'id',
          title: 'test',
          description: 'test',
          status: Issue.STATUS.CLOSED,
        },
      ];
      spyOn(Issue, 'getIssuesFromFile').and.returnValue(expectedIssues);

      expect(await Issue.fetchAll()).toEqual(expectedIssues);
    });
  });

  describe('Get index', () => {
    it('should get index when item of provided id exists in issues', async () => {
      spyOn(Issue, 'getIssuesFromFile').and.returnValue([
        {
          id: 'id',
          title: 'test',
          description: 'test',
          status: Issue.STATUS.CLOSED,
        },
      ]);

      await expectAsync(Issue.getIndex('id')).toBeResolvedTo(0);
    });

    it("should get nexgative index when item of provided id doesn't exists in issues", async () => {
      spyOn(Issue, 'getIssuesFromFile').and.returnValue([
        {
          id: 'some-id',
          title: 'test',
          description: 'test',
          status: Issue.STATUS.CLOSED,
        },
      ]);

      expect(await Issue.getIndex('other-id')).toEqual(-1);
    });
  });

  describe('Is valid status change', () => {
    it('should return true when changes from open to pending', () => {
      expect(
        Issue.isValidStatusChange(Issue.STATUS.OPEN, Issue.STATUS.PENDING)
      );
    });

    it('should return true when changes from open to closed', () => {
      expect(Issue.isValidStatusChange(Issue.STATUS.OPEN, Issue.STATUS.CLOSED));
    });

    it('should return true when changes from pending to closed', () => {
      expect(
        Issue.isValidStatusChange(Issue.STATUS.PENDING, Issue.STATUS.CLOSED)
      );
    });

    it('should return false when changes from pending to open', () => {
      expect(
        Issue.isValidStatusChange(Issue.STATUS.PENDING, Issue.STATUS.OPEN)
      );
    });

    it('should return false when changes from closed to open', () => {
      expect(Issue.isValidStatusChange(Issue.STATUS.CLOSED, Issue.STATUS.OPEN));
    });

    it('should return false when changes from closed to pending', () => {
      expect(
        Issue.isValidStatusChange(Issue.STATUS.CLOSED, Issue.STATUS.PENDING)
      );
    });
  });

  describe('Save new status', () => {
    beforeEach(() => {
      spyOn(Issue, 'getIndex');
      spyOn(Issue, 'isValidStatusChange');
      spyOn(Issue, 'getIssuesFromFile');
      spyOn(Issue, 'saveIssues');
    });

    it('should reject when index for the provided id is not found within issues', async () => {
      Issue.getIndex.and.returnValue(-1);

      await expectAsync(
        Issue.saveNewStatus('some-id', Issue.STATUS.OPEN)
      ).toBeRejectedWith("Issue of id: some-id doesn't exist!");
    });

    it('should reject status change is not valid ', async () => {
      const issue = {
        id: 1,
        title: 'test',
        description: 'test',
        status: Issue.STATUS.CLOSED,
      };
      const newStatus = Issue.STATUS.OPEN;
      Issue.getIndex.and.returnValue(0);
      Issue.getIssuesFromFile.and.returnValue([issue]);
      Issue.isValidStatusChange.and.returnValue(false);

      await expectAsync(Issue.saveNewStatus(1, newStatus)).toBeRejectedWith(
        'Invalid status change from ' + issue.status + ' to ' + newStatus + '!'
      );
    });

    it('should save issues with the issue with updated status', async () => {
      const issue = {
        id: 'some-id',
        title: 'test',
        description: 'test',
        status: Issue.STATUS.PENDING,
      };
      const otherIssue = {
        id: 'other-id',
        title: 'test',
        description: 'test',
        status: Issue.STATUS.OPEN,
      };
      const updatedIssue = {
        id: 'some-id',
        title: 'test',
        description: 'test',
        status: Issue.STATUS.CLOSED,
      };
      const newStatus = Issue.STATUS.CLOSED;
      Issue.getIndex.and.returnValue(0);
      Issue.getIssuesFromFile.and.returnValue([issue, otherIssue]);
      Issue.isValidStatusChange.and.returnValue(true);

      await Issue.saveNewStatus('some-id', newStatus);

      expect(Issue.saveIssues).toHaveBeenCalledOnceWith([
        updatedIssue,
        otherIssue,
      ]);
    });

    it('should resolve with success message', async () => {
      const issue = {
        id: 'some-id',
        title: 'test',
        description: 'test',
        status: Issue.STATUS.CLOSED,
      };
      const newStatus = Issue.STATUS.OPEN;
      Issue.getIndex.and.returnValue(0);
      Issue.getIssuesFromFile.and.returnValue([issue]);
      Issue.isValidStatusChange.and.returnValue(true);

      await expectAsync(Issue.saveNewStatus(1, newStatus)).toBeResolvedTo(
        'Status ' + newStatus + ' set successfully!'
      );
    });
  });
});
