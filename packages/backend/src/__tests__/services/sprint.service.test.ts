import { Sprint } from '@prisma/client';
import { prismaMock } from '../../models/mock/mockPrismaClient';
import sprintService from '../../services/sprint.service';
import { SprintFields } from '../../helpers/types/sprint.service.types';
import { mockSprintData, mockSprintFields, mockSprintToUpdate } from '../mocks/sprintData';

describe('sprint.service tests', () => {
  describe('create sprint', () => {
    it('should create and return sprint when called with valid fields', async () => {
      prismaMock.sprint.create.mockResolvedValue(mockSprintData);
      await expect(sprintService.newSprint(mockSprintFields)).resolves.toEqual(mockSprintData);
    });

    it('should create and return sprint when optional fields are omitted', async () => {
      const mockReturnedSprint: Sprint = {
        ...mockSprintData,
        start_date: null,
        end_date: null,
        goals: null,
      };

      const sprint: SprintFields = {
        ...mockSprintFields,
        dates: undefined,
        goals: undefined,
      };
      prismaMock.sprint.create.mockResolvedValue(mockReturnedSprint);
      await expect(sprintService.newSprint(sprint)).resolves.toEqual(mockReturnedSprint);
    });
  });

  describe('get sprints', () => {
    it('should return sprints when called with valid project id', async () => {
      const mockReturnedSprints: Sprint[] = [
        mockSprintData,
        {
          ...mockSprintData,
          id: 2,
          name: 'Sprint 2',
        },
      ];
      const projectId = 123;
      prismaMock.sprint.findMany.mockResolvedValueOnce(mockReturnedSprints);
      await expect(sprintService.listSprints(projectId)).resolves.toEqual(mockReturnedSprints);
    });
  });

  describe('update sprint', () => {
    it('should update and return sprint', async () => {
      const mockReturnedSprint: Sprint = {
        ...mockSprintData,
        duration: 2,
        end_date: new Date('2022-10-23 07:03:56'),
        goals: 'Updated goals',
      };

      prismaMock.sprint.update.mockResolvedValue(mockReturnedSprint);
      await expect(sprintService.updateSprint(mockSprintToUpdate)).resolves.toEqual(mockReturnedSprint);
    });

    it('should update and return sprint with null dates if the input "dates" is null', async () => {
      const mockReturnedSprint: Sprint = {
        ...mockSprintData,
        duration: 2,
        start_date: null,
        end_date: null,
        goals: 'Updated goals',
      };

      const sprintToUpdate: Omit<SprintFields, 'projectId'> & { sprintId: number } = {
        ...mockSprintToUpdate,
        dates: null,
      };
      prismaMock.sprint.update.mockResolvedValue(mockReturnedSprint);
      await expect(sprintService.updateSprint(sprintToUpdate)).resolves.toEqual(mockReturnedSprint);
    });
  });

  describe('update sprint status', () => {
    it('should update current and completed sprints and return updated sprint if status is current', async () => {
      const mockReturnedSprint: Sprint = {
        ...mockSprintData,
        status: 'current',
      };

      const sprintToUpdate: {
        sprintId: number;
        status: 'upcoming' | 'current' | 'completed' | 'closed';
        projectId: number;
      } = {
        sprintId: 1,
        status: 'current',
        projectId: 123,
      };
      prismaMock.sprint.findFirst.mockResolvedValueOnce(null);
      prismaMock.sprint.update.mockResolvedValue(mockReturnedSprint);
      prismaMock.sprint.updateMany.mockResolvedValue({ count: 0 });
      prismaMock.$transaction.mockResolvedValue([mockReturnedSprint, 0]);
      await expect(sprintService.updateSprintStatus(sprintToUpdate)).resolves.toEqual(mockReturnedSprint);
    });

    it('should only update current sprint and return sprint if status is not current', async () => {
      const mockReturnedSprint: Sprint = {
        ...mockSprintData,
        status: 'completed',
      };

      const sprintToUpdate: {
        sprintId: number;
        status: 'upcoming' | 'current' | 'completed' | 'closed';
        projectId: number;
      } = {
        sprintId: 1,
        status: 'completed',
        projectId: 123,
      };
      prismaMock.sprint.update.mockResolvedValue(mockReturnedSprint);
      await expect(sprintService.updateSprintStatus(sprintToUpdate)).resolves.toEqual(mockReturnedSprint);
    });

    it('should throw a BadRequestError if there is already an active sprint', async () => {
      const mockReturnedSprint: Sprint = {
        ...mockSprintData,
        status: 'current',
      };

      const sprintToUpdate: {
        sprintId: number;
        status: 'upcoming' | 'current' | 'completed' | 'closed';
        projectId: number;
      } = {
        sprintId: 1,
        status: 'current',
        projectId: 123,
      };
      prismaMock.sprint.findFirst.mockResolvedValueOnce(mockReturnedSprint);
      await expect(sprintService.updateSprintStatus(sprintToUpdate)).rejects.toThrow('An active sprint already exists');
    });
  });

  describe('delete sprint', () => {
    it('should return single sprint that got deleted', async () => {
      const mockSprintId = 1;
      prismaMock.sprint.delete.mockResolvedValue(mockSprintData);
      await expect(sprintService.deleteSprint(mockSprintId)).resolves.toEqual(mockSprintData);
    });
  });
});
