﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PickAndGo.Data;
using PickAndGo.Models;
using PickAndGo.Repositories;
using System.Diagnostics;

namespace PickAndGo.Controllers
{
    public class CustomerController : Controller
    {
        private readonly PickAndGoContext _db;

        public CustomerController(PickAndGoContext context)
        {
            _db = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [Authorize(Roles = "Customer")]
        public IActionResult CustomerDetails()
        {
            CustomerRepository cR = new CustomerRepository(_db);
            var user = User.Identity.Name;
            var vm = cR.ReturnCustomerByEmail(user);

            return View(vm);
        }

    }
}
