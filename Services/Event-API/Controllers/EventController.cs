using Microsoft.AspNetCore.Mvc;

namespace Event_API.Controllers
{
    public class EventController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
