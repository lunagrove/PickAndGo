﻿using PickAndGo.Models;
using PickAndGo.ViewModels;
using Microsoft.AspNetCore.Http;

namespace PickAndGo.Repositories
{
    public class OrderHeaderRepository
    {
        private readonly PickAndGoContext _db;

        public OrderHeaderRepository(PickAndGoContext context)
        {
            _db = context;
        }

        public Tuple<int, int> GetOverviewCounts(string date)
        {
            int outstanding = _db.OrderHeaders
                                .Where(oh => oh.OrderDate.ToString() == date)
                                .Where(oh => oh.OrderStatus == "O")
                                .Select(oh => oh.OrderStatus).Count();
            int completed = _db.OrderHeaders
                                .Where(oh => oh.OrderDate.ToString() == date)
                                .Where(oh => oh.OrderStatus == "C")
                                .Select(oh => oh.OrderStatus).Count();

            return Tuple.Create(outstanding, completed);
        }

        public Tuple<decimal, decimal> GetOverviewValues(string date)
        {
            decimal outstandingVal = (decimal)_db.OrderHeaders
                                    .Where(oh => oh.OrderDate.ToString() == date)
                                    .Where(oh => oh.OrderStatus == "O")
                                    .Select(oh => oh.OrderValue ?? 0).Sum();
            decimal completedVal = (decimal)_db.OrderHeaders
                                    .Where(oh => oh.OrderDate.ToString() == date)
                                    .Where(oh => oh.OrderStatus == "C")
                                    .Select(oh => oh.OrderValue ?? 0).Sum();

            return Tuple.Create(outstandingVal, completedVal);
        }
    }
}
