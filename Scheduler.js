function CreateCounter() {
	if (Scheduler.mode < 11 && Scheduler.mode > 0) {
		Scheduler.counter_limit = Math.pow(2, Scheduler.mode - 1);
		Scheduler.counter_started = true;
		Scheduler.counter = 0;
	}
}

function StopCounter() {
	Scheduler.counter_started = false;
	Scheduler.counter = 0;
	Scheduler.m_clicked = 0;
}

function SwitchTimer() {
	if (Scheduler.timer_started) {
		window.ClearTimeout(Scheduler.timer);
		window.ClearInterval(Scheduler.timersec);
	}

	if (Scheduler.mode < 20 && Scheduler.mode > 10) {
		Scheduler.seconds = 0;
		Scheduler.timeout = Math.pow(2, Scheduler.mode - 11) * 60 * 1000;
		Scheduler.timer = window.SetTimeout(function () {
				Scheduler.timer_started = false;
				Scheduler.m_clicked = false;
				g_settings && g_settings.buttons[4].update(false);
				switch (Scheduler.st) {
				case 0:
					fb.Stop();
					break;
				case 1:
					fb.Exit();
					break;
				case 2:
					try {
						WshShell.run("shutdown.exe -L");
					} catch (e) {
						fb.trace(e.message);
					}
					break;
				case 3:
					try {
						WshShell.run("shutdown.exe -s -t 00");
					} catch (e) {
						fb.trace(e.message);
					}
					break;
				case 4:
					try {
						WshShell.run("shutdown.exe -r -t 00");
					} catch (e) {
						fb.trace(e.message);
					}
					break;
				}
			}, Scheduler.timeout);

		Scheduler.timersec = window.SetInterval(function () {
				Scheduler.seconds++;
			}, 1000);
		Scheduler.timer_started = true;
	}

}

function StopTimer() {
	if (Scheduler.timer_started) {
		window.ClearTimeout(Scheduler.timer);
		window.ClearInterval(Scheduler.timersec);
		Scheduler.timer_started = false;
		Scheduler.seconds = 0;
		Scheduler.m_clicked = 0;
	}
}
