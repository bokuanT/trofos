import { renderHook } from '@testing-library/react';
import dayjs from 'dayjs';
import { BacklogHistory, BacklogHistoryType, BacklogStatus } from '../../api/types';
import { useBurndownChart } from './useBurndownChart';

describe('useBurndownChart hook test', () => {
  const mockSprintId = 901;
  const mockBacklogHistory: BacklogHistory[] = [
    {
      project_id: 903,
      backlog_id: 2,
      sprint_id: mockSprintId,
      history_type: BacklogHistoryType.CREATE,
      type: 'story',
      priority: 'high',
      reporter_id: 901,
      assignee_id: 902,
      points: 2,
      status: BacklogStatus.TODO,
      date: '2022-10-10T07:03:56.000Z',
    },
    {
      project_id: 903,
      backlog_id: 1,
      sprint_id: mockSprintId,
      history_type: BacklogHistoryType.CREATE,
      type: 'story',
      priority: 'very_high',
      reporter_id: 901,
      assignee_id: 902,
      points: 2,
      status: BacklogStatus.TODO,
      date: '2022-10-09T07:03:56.000Z',
    },
    {
      project_id: 903,
      backlog_id: 5,
      sprint_id: mockSprintId,
      history_type: BacklogHistoryType.CREATE,
      type: 'bug',
      priority: 'very_low',
      reporter_id: 901,
      assignee_id: 901,
      points: 2,
      status: BacklogStatus.TODO,
      date: '2022-10-13T07:03:56.000Z',
    },
    {
      project_id: 903,
      backlog_id: 4,
      sprint_id: mockSprintId,
      history_type: BacklogHistoryType.CREATE,
      type: 'bug',
      priority: 'low',
      reporter_id: 901,
      assignee_id: 902,
      points: 3,
      status: BacklogStatus.TODO,
      date: '2022-10-12T07:03:56.000Z',
    },
    {
      project_id: 903,
      backlog_id: 3,
      sprint_id: mockSprintId,
      history_type: BacklogHistoryType.UPDATE,
      type: 'task',
      priority: 'medium',
      reporter_id: 901,
      assignee_id: 901,
      points: 20,
      status: BacklogStatus.TODO,
      date: '2023-01-12T10:51:45.418Z',
    },
    {
      project_id: 903,
      backlog_id: 5,
      sprint_id: mockSprintId,
      history_type: BacklogHistoryType.UPDATE,
      type: 'bug',
      priority: 'very_low',
      reporter_id: 901,
      assignee_id: 901,
      points: 66,
      status: BacklogStatus.TODO,
      date: '2023-01-12T10:56:28.107Z',
    },
    {
      project_id: 903,
      backlog_id: 5,
      sprint_id: mockSprintId,
      history_type: BacklogHistoryType.UPDATE,
      type: 'bug',
      priority: 'very_low',
      reporter_id: 901,
      assignee_id: 901,
      points: 2,
      status: BacklogStatus.TODO,
      date: '2023-01-12T10:58:41.798Z',
    },
    {
      project_id: 903,
      backlog_id: 3,
      sprint_id: mockSprintId,
      history_type: BacklogHistoryType.UPDATE,
      type: 'task',
      priority: 'medium',
      reporter_id: 901,
      assignee_id: 901,
      points: 2,
      status: BacklogStatus.TODO,
      date: '2023-01-12T10:58:48.355Z',
    },
    {
      project_id: 903,
      backlog_id: 3,
      sprint_id: mockSprintId,
      history_type: BacklogHistoryType.CREATE,
      type: 'task',
      priority: 'medium',
      reporter_id: 901,
      assignee_id: 901,
      points: 1,
      status: BacklogStatus.TODO,
      date: '2022-10-11T07:03:56.000Z',
    },
  ];

  describe('when provided with backlog history and sprint id', () => {
    it('sorts the backlog history in ascending time order', () => {
      const { result } = renderHook(() => useBurndownChart(mockBacklogHistory, mockSprintId));

      const sortedBacklog = result.current.backlogSorted;

      // Order must be correct
      for (let i = 0; i < sortedBacklog.length - 1; i += 1) {
        expect(dayjs(sortedBacklog[i].date).isBefore(sortedBacklog[i + 1].date)).toBeTruthy();
      }

      expect(result.current.backlogSorted.length).toBe(mockBacklogHistory.length);
    });

    it('sorts the backlog history to be grouped by backlog id', () => {
      const { result } = renderHook(() => useBurndownChart(mockBacklogHistory, mockSprintId));

      const groups = result.current.backlogGrouped;
      let numHistory = 0;

      for (const [id, group] of Object.entries(groups)) {
        // Sorted by date ascending
        for (let i = 0; i < group.length - 1; i += 1) {
          expect(dayjs(group[i].date).isBefore(group[i + 1].date)).toBeTruthy();
        }

        // Grouped with the same id
        for (const backlogHistory of group) {
          expect(backlogHistory.backlog_id).toEqual(Number(id));
          numHistory += 1;
        }
      }

      // Same number of items
      expect(numHistory).toBe(mockBacklogHistory.length);
    });

    // A create todo history
    const baseHistory: BacklogHistory = {
      project_id: 903,
      backlog_id: 3,
      sprint_id: mockSprintId,
      history_type: BacklogHistoryType.CREATE,
      type: 'task',
      priority: 'medium',
      reporter_id: 901,
      assignee_id: 901,
      points: 1,
      status: BacklogStatus.TODO,
      date: '2022-10-11T07:03:56.000Z',
    };

    const nextDay = '2022-10-12T07:03:56.000Z';
    const prevDay = '2022-10-10T07:03:56.000Z';

    it('returns the correct story point array for create', () => {
      const history: BacklogHistory[] = [baseHistory];
      const { result } = renderHook(() => useBurndownChart(history, mockSprintId));

      expect(result.current.storyPointData[0].point).toBe(baseHistory.points);
      expect(result.current.storyPointData[0].date).toStrictEqual(new Date(baseHistory.date));
      expect(result.current.storyPointData[0].type).toStrictEqual(BacklogHistoryType.CREATE);
    });

    it('returns the correct story point array for update backlog (no change)', () => {
      const history: BacklogHistory[] = [
        baseHistory,
        // These updates do not affect story point
        {
          ...baseHistory,
          history_type: BacklogHistoryType.UPDATE,
          date: nextDay,
          assignee_id: 111,
          priority: 'high',
          reporter_id: 222,
          type: 'bug',
        },
      ];
      const { result } = renderHook(() => useBurndownChart(history, mockSprintId));

      expect(result.current.storyPointData.length).toBe(1);
      expect(result.current.storyPointData[0].point).toBe(baseHistory.points);
    });

    it('returns the correct story point array for update backlog (To do => Done)', () => {
      const history: BacklogHistory[] = [
        baseHistory,
        {
          ...baseHistory,
          history_type: BacklogHistoryType.UPDATE,
          status: BacklogStatus.DONE,
          date: nextDay,
        },
      ];
      const { result } = renderHook(() => useBurndownChart(history, mockSprintId));

      expect(result.current.storyPointData.length).toBe(2);
      expect(result.current.storyPointData[0].point).toBe(1);
      // The story point in the end should be 0
      expect(result.current.storyPointData[1].point).toBe(0);
    });

    it('returns the correct story point array for update backlog (To do => Done => To do)', () => {
      const history: BacklogHistory[] = [
        { ...baseHistory, date: prevDay },
        { ...baseHistory, history_type: BacklogHistoryType.UPDATE, status: BacklogStatus.DONE },
        { ...baseHistory, history_type: BacklogHistoryType.UPDATE, date: nextDay },
      ];
      const { result } = renderHook(() => useBurndownChart(history, mockSprintId));

      expect(result.current.storyPointData.length).toBe(3);
      expect(result.current.storyPointData[0].point).toBe(1);
      expect(result.current.storyPointData[1].point).toBe(0);
      // Story point back to 2
      expect(result.current.storyPointData[2].point).toBe(1);
    });

    it('returns the correct story point array for update backlog (To do => In progress)', () => {
      const history: BacklogHistory[] = [
        baseHistory,
        { ...baseHistory, history_type: BacklogHistoryType.UPDATE, status: 'In progress', date: nextDay },
      ];
      const { result } = renderHook(() => useBurndownChart(history, mockSprintId));

      expect(result.current.storyPointData.length).toBe(2);
      expect(result.current.storyPointData[0].point).toBe(1);
      // Same point
      expect(result.current.storyPointData[1].point).toBe(1);
    });

    it('returns the correct story point array for update backlog (Increase point)', () => {
      const history: BacklogHistory[] = [
        baseHistory,
        {
          ...baseHistory,
          history_type: BacklogHistoryType.UPDATE,
          points: (baseHistory.points as number) + 1,
          date: nextDay,
        },
      ];
      const { result } = renderHook(() => useBurndownChart(history, mockSprintId));

      expect(result.current.storyPointData.length).toBe(2);
      expect(result.current.storyPointData[0].point).toBe(1);
      // Added one point
      expect(result.current.storyPointData[1].point).toBe(2);
    });

    it('returns the correct story point array for update backlog (Decrease point)', () => {
      const history: BacklogHistory[] = [
        baseHistory,
        {
          ...baseHistory,
          history_type: BacklogHistoryType.UPDATE,
          points: (baseHistory.points as number) - 1,
          date: nextDay,
        },
      ];
      const { result } = renderHook(() => useBurndownChart(history, mockSprintId));

      expect(result.current.storyPointData.length).toBe(2);
      expect(result.current.storyPointData[0].point).toBe(1);
      // Minus one point
      expect(result.current.storyPointData[1].point).toBe(0);
    });

    it('returns the correct story point array for delete backlog', () => {
      const history: BacklogHistory[] = [
        baseHistory,
        { ...baseHistory, history_type: BacklogHistoryType.DELETE, date: nextDay },
      ];
      const { result } = renderHook(() => useBurndownChart(history, mockSprintId));

      expect(result.current.storyPointData.length).toBe(2);
      expect(result.current.storyPointData[0].point).toBe(1);
      expect(result.current.storyPointData[1].point).toBe(0);
    });
  });
});
