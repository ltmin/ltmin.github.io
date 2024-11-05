import init, {
  bootstrap,
  list_codes,
  add_secret,
  remove_secret,
  register,
  login,
  logout,
  is_logged_in,
  is_registered,
  edit_secret,
  export_backup,
  restore_backup,
  edit_password,
} from "./pkg/totp_db.js";

const state = {};

const TAB_ACTIVE_CLASSES = "border-4 border-indigo-200 border-b-indigo-500";

function genCodeItem(code) {
  const html = `
  <li class="flex justify-between gap-x-6 py-4 px-2 cursor-pointer max-h-24" id="code-${code.id}">
    <div class="flex min-w-48 gap-x-4">
      <div class="min-w-0 flex-auto x-code-container">
        <p class="x-code-label text-sm font-semibold text-gray-900">${code.label}</p>
        <p class="x-code-code mt-1 truncate text-lg text-gray-500 h-7">******</p>
      </div>
    </div>
    <div class="shrink-0 flex flex-1 items-center justify-center">
      <p class="x-timer mt-1 text-sm text-gray-500">--</p>
    </div>
    <div class="x-edit shrink-0 flex flex-1 items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    </div>
  </li>`;

  return html;
}

function mutateItems() {
  function handleEdit(node) {
    const id = $(node).attr("id").replace("code-", "");

    state.curCode = state.codes?.find((item) => item.id === id);

    gotoItem(state.curCode);
  }

  function handleCopy(container) {
    const id = $(container).attr("id").replace("code-", "");
    const node = $(container).find(".x-code-code");

    const code = state.codes?.find((item) => item.id === id);

    navigator.clipboard.writeText(code?.code || "");
    $(node).text(code?.code);
    $(node).addClass("animate-blinkingCopy reveal");
    $(node).removeClass("reveal-1");

    setTimeout(() => {
      $(node).removeClass("animate-blinkingCopy");
    }, 200);
  }

  function display() {
    const codes = state.codes || [];

    const children = $("#list-codes").children();

    for (let i = 0; i < codes.length; i++) {
      if (!children[i]) {
        $("#list-codes").append(genCodeItem(codes[i]));

        const node = $("#list-codes").children()[i];

        $(node.querySelector(".x-edit")).click(() => handleEdit(node));
        $(node.querySelector(".x-code-container")).click(() =>
          handleCopy(node)
        );
      } else if ($(children[i]).attr("id") !== `code-${codes[i].id}`) {
        $(children[i]).replaceWith(genCodeItem(codes[i]));

        const node = $("#list-codes").children()[i];
        $(node.querySelector(".x-edit"))
          .off()
          .click(() => handleEdit(node));
        $(node.querySelector(".x-code-container"))
          .off()
          .click(() => handleCopy(node));
      } else {
        const labelChildren = $(`#code-${codes[i].id} .x-code-label`);
        const codeChildren = $(`#code-${codes[i].id} .x-code-code`);
        if (labelChildren.text() !== codes[i].label) {
          labelChildren.text(codes[i].label);
        }
        if (codeChildren.text() !== codes[i].code) {
          if (codeChildren.hasClass("reveal")) {
            codeChildren.removeClass("reveal");
            codeChildren.addClass("reveal-1");
            codeChildren.text(codes[i].code);
          } else if (codeChildren.hasClass("reveal-1")) {
            codeChildren.removeClass("reveal-1");
            codeChildren.text(codes[i].code);
          } else if (codeChildren.text() !== "******") {
            codeChildren.text("******");
          }
        }
      }
    }
    for (let i = codes.length; i < children.length; i++) {
      $(children[i]).remove();
    }
  }

  function displaySeconds() {
    const seconds = new Date().getSeconds();

    $("#list-codes .x-timer").text((60 - seconds).toString().padStart(2, "0"));
  }

  return list_codes().then((codes) => {
    state.codes = codes;

    display();
    displaySeconds();
  });
}

function btnUnlockLoading(loading) {
  if (loading) {
    $("#btn-unlock").attr("disabled", "true");
    $("#btn-unlock-submit-loading").show();
  } else {
    $("#btn-unlock").removeAttr("disabled");
    $("#btn-unlock-submit-loading").hide();
  }
}

function btnLogoutLoading(loading) {
  if (loading) {
    $("#btn-logout").attr("disabled", "true");
    $("#btn-logout-loading").css("display", "");
  } else {
    $("#btn-logout").removeAttr("disabled");
    $("#btn-logout-loading").css("display", "none");
  }
}

function btnItemSubmitLoading(loading) {
  if (loading) {
    $("#btn-item-submit").attr("disabled", "true");
    $("#btn-item-submit-loading").css("display", "");
  } else {
    $("#btn-item-submit").removeAttr("disabled");
    $("#btn-item-submit-loading").css("display", "none");
  }
}

function btnItemDeleteLoading(loading) {
  if (loading) {
    $("#btn-item-delete").attr("disabled", "true");
    $("#btn-item-delete-loading").css("display", "");
  } else {
    $("#btn-item-delete").removeAttr("disabled");
    $("#btn-item-delete-loading").css("display", "none");
  }
}

function btnEditPasswordLoading(loading) {
  if (loading) {
    $("#btn-edit-password").attr("disabled", "true");
    $("#btn-edit-password-loading").css("display", "");
  } else {
    $("#btn-edit-password").removeAttr("disabled");
    $("#btn-edit-password-loading").css("display", "none");
  }
}

function btnRestoreLoading(loading) {
  if (loading) {
    $("#btn-restore").attr("disabled", "true");
    $("#btn-restore-loading").css("display", "");
  } else {
    $("#btn-restore").removeAttr("disabled");
    $("#btn-restore-loading").css("display", "none");
  }
}

function gotoList() {
  state.tab = "list";

  $("#tabs-list").show();
  $("#tabs-item-list > a").addClass(TAB_ACTIVE_CLASSES);
  $("#tabs-item").hide();
  $("#tabs-item-item > a").removeClass(TAB_ACTIVE_CLASSES);
  $("#tabs-account").hide();
  $("#tabs-item-account > a").removeClass(TAB_ACTIVE_CLASSES);

  mutateItems();
}

function gotoItem(curCode) {
  state.tab = "item";

  $("#tabs-list").hide();
  $("#tabs-item-list > a").removeClass(TAB_ACTIVE_CLASSES);
  $("#tabs-item").show();
  $("#tabs-item-item > a").addClass(TAB_ACTIVE_CLASSES);
  $("#tabs-account").hide();
  $("#tabs-item-account > a").removeClass(TAB_ACTIVE_CLASSES);

  if (curCode) {
    $("#inp-item-secret-container").hide();
    $("#btn-item-delete").show();
    $("#inp-item-label").val(curCode.label);
    $("#btn-item-submit-text").text("Update");
  } else {
    $("#inp-item-secret-container").show();
    $("#btn-item-delete").hide();
    $("#inp-item-label").val("");
    $("#inp-item-secret").val("");
    $("#btn-item-submit-text").text("Create");
  }
}

function gotoAccountUnlock(isRegistered) {
  state.tab = "account";

  $("#inp-password").val("");

  $("#tabs-list").hide();
  $("#tabs-item-list > a").removeClass(TAB_ACTIVE_CLASSES);
  $("#tabs-item").hide();
  $("#tabs-item-item > a").removeClass(TAB_ACTIVE_CLASSES);
  $("#tabs-account").show();
  $("#tabs-item-account > a").addClass(TAB_ACTIVE_CLASSES);

  $("#account-loggedin").hide();
  $("#account-manage").show();
  $("#account-edit-password").hide();
  $("#account-unlock").show();
  $("#form-unlock")[0].reset();
  if (!isRegistered) {
    $("#btn-unlock-submit-text").text("Create");
  } else {
    $("#btn-unlock-submit-text").text("Unlock");
  }
}

function gotoAccountManage() {
  state.tab = "account";

  $("#tabs-list").hide();
  $("#tabs-item-list > a").removeClass(TAB_ACTIVE_CLASSES);
  $("#tabs-item").hide();
  $("#tabs-item-item > a").removeClass(TAB_ACTIVE_CLASSES);
  $("#tabs-account").show();
  $("#tabs-item-account > a").addClass(TAB_ACTIVE_CLASSES);

  $("#account-loggedin").show();
  $("#account-manage").show();
  $("#account-restore").hide();
  $("#account-edit-password").hide();
  $("#account-unlock").hide();
}

function gotoAccountEditPassword() {
  state.tab = "account";

  $("#tabs-list").hide();
  $("#tabs-item-list > a").removeClass(TAB_ACTIVE_CLASSES);
  $("#tabs-item").hide();
  $("#tabs-item-item > a").removeClass(TAB_ACTIVE_CLASSES);
  $("#tabs-account").show();
  $("#tabs-item-account > a").addClass(TAB_ACTIVE_CLASSES);

  $("#account-loggedin").show();
  $("#account-manage").hide();
  $("#account-restore").hide();
  $("#account-unlock").hide();
  $("#account-edit-password").show();
  $("#form-edit-password")[0].reset();
}

function gotoAccountRestore() {
  state.tab = "account";

  $("#tabs-list").hide();
  $("#tabs-item-list > a").removeClass(TAB_ACTIVE_CLASSES);
  $("#tabs-item").hide();
  $("#tabs-item-item > a").removeClass(TAB_ACTIVE_CLASSES);
  $("#tabs-account").show();
  $("#tabs-item-account > a").addClass(TAB_ACTIVE_CLASSES);

  $("#account-loggedin").show();
  $("#account-manage").hide();
  $("#account-edit-password").hide();
  $("#account-restore").show();
  $("#account-unlock").hide();
  $("#form-restore")[0].reset();
}

function handleRegisterOrLogin(e) {
  e.preventDefault();

  const password = $("#inp-password").val();

  btnUnlockLoading(true);

  setTimeout(() => {
    register(password)
      .then((success) => success || login(password))
      .then((success) => {
        btnUnlockLoading(false);

        if (success) {
          state.isRegistered = true;
          state.isLoggedIn = true;
          gotoList();
        } else {
          alert("Wrong password, please try again in 5 seconds.");
        }
      });
  }, 50);
}

function handleLogout(e) {
  e.preventDefault();

  btnLogoutLoading(true);

  setTimeout(() => {
    logout().then((success) => {
      btnLogoutLoading(false);
      state.isLoggedIn = false;
      gotoAccountUnlock(true);
    });
  }, 50);
}

function handleItem(e) {
  e.preventDefault();

  btnItemSubmitLoading(true);

  setTimeout(() => {
    const label = $("#inp-item-label").val();
    const secret = $("#inp-item-secret").val();

    if (state.curCode) {
      edit_secret(state.curCode.id, label).then((success) => {
        btnItemSubmitLoading(false);
        if (success) {
          gotoList();

          state.curCode = null;
        } else {
          alert("Fail to update secret, please try again.");
        }
      });
    } else {
      add_secret(label, secret).then((success) => {
        btnItemSubmitLoading(false);
        if (success) {
          gotoList();
        } else {
          alert("Invalid secret, please try again!");
        }
      });
    }
  }, 10);
}

function handleItemDelete(e) {
  e.preventDefault();
  if (!confirm("The item will be deleted, are you sure ?")) {
    return;
  }

  btnItemDeleteLoading(true);

  setTimeout(() => {
    if (state.curCode) {
      remove_secret(state.curCode.id).then((success) => {
        btnItemDeleteLoading(false);
        if (success) {
          gotoList();

          state.curCode = null;
        } else {
          alert("Fail to delete secret, please try again.");
        }
      });
    }
  }, 10);
}

function handleBackup(e) {
  e.preventDefault();

  export_backup().then((data) => {
    const blob = new Blob([data.buffer]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "backup.totp";
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

function handleRestore(e) {
  e.preventDefault();
  const file = $("#inp-restore-file").get(0).files[0];
  const password = $("#inp-restore-password").val();
  if (!file || !password) {
    return;
  }

  function readFile() {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        const buffer = event.target.result;

        resolve(new Uint8Array(buffer));
      });

      reader.readAsArrayBuffer(file);
    });
  }

  btnRestoreLoading(true);

  setTimeout(() => {
    readFile()
      .then((buffer) => restore_backup(password, buffer))
      .then((success) => {
        btnRestoreLoading(false);
        if (success) {
          alert("Restore the backup successfully.");

          gotoList();
        } else {
          alert(
            "Restore failed, please check the password and try again in 5 seconds."
          );
        }
      });
  }, 20);
}

function handleEditPassword(e) {
  e.preventDefault();

  const oldPassword = $("#inp-old-password").val();
  const newPassword = $("#inp-new-password").val();
  const confirmNewPassword = $("#inp-confirm-new-password").val();

  if (newPassword !== confirmNewPassword) {
    alert("Password and confirm password do not match");

    return;
  }

  btnEditPasswordLoading(true);
  setTimeout(() => {
    edit_password(oldPassword, newPassword).then((success) => {
      btnEditPasswordLoading(false);

      if (!success) {
        alert("Wrong password, please try again in 5 seconds.");
      } else {
        alert("Password has been updated.");

        gotoAccountManage();
      }
    });
  }, 20);
}

function bindEvents() {
  $("#form-unlock").submit(handleRegisterOrLogin);
  $("#form-logout").submit(handleLogout);
  $("#form-item").submit(handleItem);
  $("#btn-item-delete").click(handleItemDelete);
  $("#btn-backup").click(handleBackup);
  $("#btn-to-restore").click(gotoAccountRestore);
  $("#btn-restore-back").click(gotoAccountManage);
  $("#btn-restore").click(handleRestore);
  $("#form-edit-password").submit(handleEditPassword);
  $("#btn-to-edit-password").click(gotoAccountEditPassword);
  $("#btn-edit-password-back").click(gotoAccountManage);

  $("#tabs-item-list").click(() => {
    state.curCode = null;
    if (state.isLoggedIn) {
      gotoList();
    }
  });
  $("#tabs-item-item").click(() => {
    state.curCode = null;
    if (state.isLoggedIn) {
      gotoItem();
    }
  });
  $("#tabs-item-account").click(() => {
    state.curCode = null;
    if (!state.isLoggedIn) {
      gotoAccountUnlock(state.isRegistered);
    } else {
      gotoAccountManage();
    }
  });
}

function bindJobs() {
  function refreshCodes() {
    mutateItems().then(() => {
      setTimeout(refreshCodes, 1000);
    });
  }

  function checkLogin() {
    setInterval(async () => {
      state.isLoggedIn = await is_logged_in();

      if (!state.isLoggedIn && state.tab !== "account") {
        gotoAccountUnlock(state.isRegistered);
      }
    }, 5000);
  }

  refreshCodes();
  checkLogin();
}

window.run = async function (w, d) {
  await init();
  await bootstrap();

  state.isRegistered = await is_registered();

  bindEvents();
  bindJobs();

  $("#page-loading").css("display", "none");

  gotoAccountUnlock(state.isRegistered);
};

window.run(window, document);
